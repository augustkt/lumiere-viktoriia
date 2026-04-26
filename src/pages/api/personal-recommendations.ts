import type { NextApiRequest, NextApiResponse } from "next";
import { unstable_getServerSession } from "next-auth/next";
import { authOptions } from "./auth/[...nextauth]";
import { doc, collection, getDocs } from "firebase/firestore";
import { db } from "@/app/firebase";
import * as TMDB from "@/lib/tmdb";
import { UserStateCollection, MediaType } from "@/types/general";
import { parseMediaSingleItemData } from "@/lib/media-parser";

/**
 * /api/personal-recommendations
 *
 * Returns a deduplicated, popularity-sorted list of TMDB recommendations
 * derived from the user's top 5 favorites + top 3 highest-rated titles.
 * Used to power the "Для вас" / "For you" block on the profile page.
 */
export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const session = await unstable_getServerSession(req, res, authOptions);
  if (!session) {
    res.status(401).json({ message: "You must be logged in." });
    return;
  }

  const lang = (req.query?.lang as string) || undefined;

  const userDocRef = doc(db, "users", session.user.id);

  // Pull seed titles: favorites (recent first) + top-rated user ratings
  const [favSnap, ratingsSnap] = await Promise.all([
    getDocs(collection(userDocRef, UserStateCollection.Favorites)),
    getDocs(collection(userDocRef, UserStateCollection.Ratings)),
  ]);

  const favorites = favSnap.docs.map((d) => d.data() as any);
  const ratings = ratingsSnap.docs
    .map((d) => d.data() as any)
    .sort((a, b) => (b.rating ?? 0) - (a.rating ?? 0))
    .filter((r) => (r.rating ?? 0) >= 7);

  // Up to 6 seed titles, deduped by id+type
  const seenSeeds = new Set<string>();
  const seeds: Array<{ id: number; mediaType: `${MediaType}` }> = [];
  for (const item of [...ratings, ...favorites]) {
    const key = `${item.mediaType}-${item.id}`;
    if (!seenSeeds.has(key) && item.mediaType && item.id) {
      seenSeeds.add(key);
      seeds.push({ id: item.id, mediaType: item.mediaType });
      if (seeds.length >= 6) break;
    }
  }

  if (seeds.length === 0) {
    res.status(200).json({ results: [], seeds: 0 });
    return;
  }

  // Fetch TMDB recommendations for each seed in parallel
  const recPages = await Promise.all(
    seeds.map(async (seed) => {
      try {
        const detail =
          seed.mediaType === MediaType.Movie
            ? await TMDB.getMovieDetailsById(seed.id, lang)
            : await TMDB.getTvShowDetailsById(seed.id, lang);
        return ((detail as any).recommendations?.results ?? []).map(
          (r: any) => ({
            ...r,
            media_type: r.media_type ?? seed.mediaType,
          })
        );
      } catch {
        return [];
      }
    })
  );

  // Flatten + dedupe + remove user's own seeds + sort by popularity
  const seenRecs = new Set<string>(
    seeds.map((s) => `${s.mediaType}-${s.id}`)
  );
  const merged: any[] = [];
  for (const page of recPages) {
    for (const r of page) {
      const key = `${r.media_type}-${r.id}`;
      if (!seenRecs.has(key) && r.poster_path) {
        seenRecs.add(key);
        merged.push(r);
      }
    }
  }

  merged.sort((a, b) => (b.popularity ?? 0) - (a.popularity ?? 0));
  const top = merged.slice(0, 18).map((r) => parseMediaSingleItemData(r));

  res.status(200).json({ results: top, seeds: seeds.length });
}
