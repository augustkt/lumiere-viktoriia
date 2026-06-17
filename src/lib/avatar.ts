/**
 * Generates a pretty SVG avatar with initials when an actor's profile_path
 * is missing from TMDB. Hash the name to pick a consistent gradient so
 * the same actor always gets the same colors.
 */

const GRADIENTS: Array<[string, string]> = [
  ["#7C3AED", "#3B82F6"], // violet → blue
  ["#EC4899", "#8B5CF6"], // pink → violet
  ["#F59E0B", "#EF4444"], // amber → red
  ["#10B981", "#3B82F6"], // emerald → blue
  ["#F472B6", "#A78BFA"], // rose → purple
  ["#FB923C", "#EC4899"], // orange → pink
  ["#14B8A6", "#8B5CF6"], // teal → violet
  ["#FBBF24", "#F472B6"], // yellow → pink
];

const hashString = (s: string): number => {
  let h = 0;
  for (let i = 0; i < s.length; i++) {
    h = (h << 5) - h + s.charCodeAt(i);
    h |= 0;
  }
  return Math.abs(h);
};

const getInitials = (name: string): string => {
  if (!name) return "?";
  const parts = name.trim().split(/\s+/).filter(Boolean);
  if (parts.length === 0) return "?";
  if (parts.length === 1) return parts[0].slice(0, 2).toUpperCase();
  return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase();
};

export const generateInitialsAvatar = (name: string): string => {
  const initials = getInitials(name);
  const [from, to] = GRADIENTS[hashString(name) % GRADIENTS.length];
  const id = `g${hashString(name) % 10000}`;

  const svg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 150 150">
    <defs>
      <linearGradient id="${id}" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" stop-color="${from}"/>
        <stop offset="100%" stop-color="${to}"/>
      </linearGradient>
    </defs>
    <rect width="150" height="150" fill="url(#${id})"/>
    <text x="50%" y="50%" dy=".1em" text-anchor="middle" dominant-baseline="middle"
      font-family="-apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif"
      font-size="56" font-weight="700" fill="white" letter-spacing="2">${initials}</text>
  </svg>`;

  return `data:image/svg+xml,${encodeURIComponent(svg)}`;
};
