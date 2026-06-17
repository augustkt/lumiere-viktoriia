import type { NextApiRequest, NextApiResponse } from "next";
import { unstable_getServerSession } from "next-auth/next";
import { authOptions } from "./auth/[...nextauth]";
import {
  doc,
  setDoc,
  collection,
  deleteDoc,
  getDoc,
  serverTimestamp,
} from "firebase/firestore";
import { db } from "@/app/firebase";
import * as TMDB from "@/lib/tmdb";
import { MediaType, UserStateCollection } from "@/types/general";
import { pick } from "@/utils/util";
import { getPath, parseMediaDetailsData } from "@/lib/media-parser";

/**
 * /api/rating
 *
 * GET    ?mediaType=movie&mediaId=123  -> { rating: number | null }
 * PUT    body: { mediaType, mediaId, rating }  (rating: 1..10)
 * DELETE body: { mediaType, mediaId }
 *
 * Stored at: users/{userId}/ratings/{mediaType}-{mediaId}
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

  const userDocRef = doc(db, "users", session.user.id);
  const ratingsCollectionRef = collection(
    userDocRef,
    UserStateCollection.Ratings
  );

  // Parse mediaId/mediaType from query (GET) or body (PUT/DELETE)
  const source = req.method === "GET" ? req.query : req.body;
  const mediaId = Number(source?.mediaId ?? 0);
  const mediaType = source?.mediaType as `${MediaType}` | undefined;

  if (
    isNaN(mediaId) ||
    mediaId === 0 ||
    !mediaType ||
    !(mediaType === MediaType.Movie || mediaType === MediaType.TV)
  ) {
    res.status(400).json({ message: "Bad request" });
    return;
  }

  const ratingDocRef = doc(ratingsCollectionRef, `${mediaType}-${mediaId}`);

  switch (req.method) {
    case "GET": {
      const snapshot = await getDoc(ratingDocRef);
      const data = snapshot.exists() ? snapshot.data() : null;
      res.status(200).json({
        mediaId,
        mediaType,
        rating: data?.rating ?? null,
      });
      return;
    }

    case "PUT": {
      const rating = Number(req.body?.rating);
      if (isNaN(rating) || rating < 1 || rating > 10) {
        res
          .status(400)
          .json({ message: "Rating must be a number between 1 and 10" });
        return;
      }

      try {
        const rawMediaData = await (mediaType === MediaType.Movie
          ? TMDB.getMovieDetailsById(mediaId)
          : TMDB.getTvShowDetailsById(mediaId));

        const mediaData = parseMediaDetailsData(rawMediaData);

        await setDoc(ratingDocRef, {
          ...pick(
            mediaData,
            "id",
            "title",
            "mediaType",
            "posterImageUrl",
            "year"
          ),
          path: getPath(mediaData.id, mediaData.title, mediaData.mediaType),
          rating,
          ratedAt: serverTimestamp(),
        });

        res.status(200).json({ mediaId, mediaType, rating });
      } catch (err) {
        console.error(err);
        res.status(500).json({ message: "Could not save rating" });
      }
      return;
    }

    case "DELETE": {
      try {
        await deleteDoc(ratingDocRef);
        res.status(204).end();
      } catch (err) {
        console.error(err);
        res.status(500).json({ message: "Could not delete rating" });
      }
      return;
    }

    default: {
      res.setHeader("Allow", "GET, PUT, DELETE");
      res.status(405).end();
    }
  }
}
