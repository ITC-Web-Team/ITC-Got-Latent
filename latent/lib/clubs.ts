export interface ClubDef {
  slug: string;
  name: string;
}

// NOTE: the brief said "13 clubs" but listed 15 names — all 15 named clubs
// are included here. Trim this list if 13 was the intended count.
export const CLUBS: ClubDef[] = [
  { slug: "krittika", name: "Krittika" },
  { slug: "aeromodeling", name: "Aeromodeling" },
  { slug: "wncc", name: "WnCC" },
  { slug: "tinkerers-lab", name: "Tinkerers Lab" },
  { slug: "quant-club", name: "Quant Club" },
  { slug: "csec-club", name: "CSeC Club" },
  { slug: "biox", name: "Biox" },
  { slug: "energy-sustainability-club", name: "Energy and Sustainability Club" },
  { slug: "math-physics-club", name: "Math and Physics Club" },
  { slug: "electronics-robotics-club", name: "Electronics and Robotics Club" },
  { slug: "chemistry-cheme-tl", name: "Chemistry Club & ChemE TL" },
  { slug: "web-team", name: "Web Team" },
  { slug: "design-team", name: "Design Team" },
  { slug: "media-team", name: "Media Team" },
];
