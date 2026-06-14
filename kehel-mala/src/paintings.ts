export type Orientation = 'landscape' | 'portrait';

// ── Filter facets ───────────────────────────────────────────────────────────
// The gallery is browsable along four independent axes, shown as the filter
// sections on the "All" page: Artist · Theme · Product · Type. Each section only
// ever lists values that actually appear on the page you're looking at.

// Artist — who made the piece. Stored in a piece's `tags`.
export const ARTISTS = ['milindi', 'chaamudi', 'guest star'] as const;
export type Artist = (typeof ARTISTS)[number];

// Type — the medium / technique (photography, painting, watercolour, …). Also
// stored in `tags`. This is the "Type" filter section.
export const TYPES = [
  'watercolour',
  'oil paint',
  'acrylic',
  'pencil',
  'pen',
  'texture',
  'photography',
  'digital art',
  'chalk',
  'felt',
  'tuft',
  'canvas',
] as const;
export type ArtType = (typeof TYPES)[number];

// Everything that can live in a piece's `tags` array (artist + type).
export const TAGS = [...ARTISTS, ...TYPES] as const;
export type Tag = Artist | ArtType;

// Product — the physical form(s). Drives the Gallery sub-menu. A piece can
// belong to MORE than one (e.g. a design sold as both a Print and a Tea Towel),
// so it's a list; an empty/omitted list falls back to 'prints'. "Other" is the
// catch-all for felt, wood, clay, etc.
export const PRODUCTS = [
  { id: 'prints', label: 'Prints' },
  { id: 'tea-towels', label: 'Tea Towels' },
  { id: 'websites', label: 'Websites' },
  { id: 'zines', label: 'Zines' },
  { id: 'comics', label: 'Comics' },
  { id: 'other', label: 'Other' },
] as const;

export type Product = (typeof PRODUCTS)[number]['id'];

// Pieces with no `products` fall into 'prints'.
export const DEFAULT_PRODUCT: Product = 'prints';

export interface Painting {
  id: string;
  title: string;
  /** Who made it — shown as a small muted line above the title (e.g. 'Milindi'). */
  artist?: string;
  /** Medium — shown as a small caption under the title (e.g. 'Oil on canvas'). */
  medium?: string;
  /** Creation date as 'YYYY-MM' (month + year). Drives the Newest/Oldest sort. */
  date?: string;
  /** Physical size, free text (e.g. 'A4 · 21 × 29.7 cm'). Shown on the detail page. */
  dimensions?: string;
  /** Longer story / notes about the piece — shown only on the detail page. */
  description?: string;
  /** Filter tags from the TAGS vocabulary (artist + type). */
  tags?: Tag[];
  /**
   * Which Gallery section(s) this belongs to — a piece can be in several at once
   * (e.g. ['prints', 'tea-towels']). Defaults to ['prints'].
   */
  products?: Product[];
  /**
   * Free-text subject themes (the "Theme" filter), e.g. ['Tea', 'Sri Lanka'].
   * Add your own — whatever strings you use here become the Theme chips, and a
   * theme only appears on a page if a piece on that page carries it.
   */
  themes?: string[];
  /** Show on the landing page's featured rows (grouped by product). */
  featured?: boolean;
  /**
   * For website pieces — the live site URL. The detail page embeds it in an
   * iframe (with an "Open site" link as fallback for sites that block embedding).
   */
  url?: string;
  /** 'landscape' (wide) or 'portrait' (tall) — controls the tile shape. */
  orientation: Orientation;
  /** Primary image path (the `-version-1` file). For websites, a screenshot. */
  image: string;
  /**
   * TOTAL number of version files for this piece, named `<base>-version-<n>`.
   * e.g. image '.../sparkles-1-version-1.png' with versions: 3 also loads
   * '...-version-2.png' and '...-version-3.png'. Omit (or 1) for a single image.
   */
  versions?: number;
  /** Or list extra version files explicitly (overrides `versions` if both are set). */
  variants?: string[];
}

// ── Facet extractors ────────────────────────────────────────────────────────
// Used by the gallery to read a piece's value(s) for each filter axis.
export function artistsOf(p: Painting): Artist[] {
  return (p.tags ?? []).filter((t): t is Artist =>
    (ARTISTS as readonly string[]).includes(t),
  );
}
export function typesOf(p: Painting): ArtType[] {
  return (p.tags ?? []).filter((t): t is ArtType =>
    (TYPES as readonly string[]).includes(t),
  );
}
export function themesOf(p: Painting): string[] {
  return p.themes ?? [];
}
export function productsOf(p: Painting): Product[] {
  return p.products && p.products.length ? p.products : [DEFAULT_PRODUCT];
}
export function productLabel(id: Product): string {
  return PRODUCTS.find((p) => p.id === id)?.label ?? id;
}

export const paintings: Painting[] = [

  // ════════════════════════════════════════════════════════════════════════════
  // LANDSCAPES
  // ════════════════════════════════════════════════════════════════════════════

  // ── Prints ──
  {
      id: '1',
      title: 'Autumn',
      medium: 'photography',
      date: '',
      dimensions: '',
      description: '',
      tags: ['milindi', 'photography'],
      products: ['prints'],
      themes: ['nature'],
      orientation: 'landscape',
      image: '/paintings/landscapes/autumn-1-version-1.png'
  },
  {
      id: '2',
      title: 'Whisps in the wind',
      medium: 'photography',
      date: '',
      dimensions: '',
      description: '',
      tags: ['milindi', 'photography'],
      products: ['prints'],
      themes: ['sky', 'sunrise', 'city'],
      orientation: 'landscape',
      image: '/paintings/landscapes/cloud-1-version-1.png', versions: 3
  },
  {
      id: '3',
      title: 'Sepalika',
      medium: 'watercolour',
      date: '',
      dimensions: '',
      description: '',
      tags: ['milindi', 'watercolour'],
      products: ['prints'],
      themes: ['nature', 'plants'],
      featured: true,
      orientation: 'landscape',
      image: '/paintings/landscapes/flowers-1-version-1.png', versions: 2
  },
  {
      id: '5',
      title: 'kude',
      medium: '',
      date: '',
      dimensions: '',
      description: '',
      tags: [],
      products: ['prints'],
      themes: [],
      orientation: 'landscape',
      image: '/paintings/landscapes/kude-1-version-1.png'
  },
  {
      id: '6',
      title: 'Mind Map',
      medium: 'watercolour',
      date: '',
      dimensions: '',
      description: '',
      tags: ['chaamudi', 'watercolour', 'pen'],
      products: ['prints'],
      themes: [],
      orientation: 'landscape',
      image: '/paintings/landscapes/mind-map-1-version-1.png'
  },
  {
      id: '7',
      title: 'Sunrise Through The Years',
      medium: 'photography',
      date: '',
      dimensions: '',
      description: '',
      tags: ['milindi', 'photography'],
      products: ['prints'],
      themes: ['sky', 'sunrise', 'city'],
      orientation: 'landscape',
      image: '/paintings/landscapes/morning-1-version-1.png', versions: 8
  },
  {
      id: '8',
      title: 'New Years!',
      medium: 'photography',
      date: '',
      dimensions: '',
      description: '',
      tags: ['photography'],
      products: ['prints'],
      themes: ['city', 'sky'],
      orientation: 'landscape',
      image: '/paintings/landscapes/new-year-cbd-1-version-1.png'
  },
  {
      id: '9',
      title: 'Tea Estates',
      medium: 'photography',
      date: '',
      dimensions: '',
      description: '',
      tags: ['photography'],
      products: ['prints'],
      themes: ['nature', 'tea', 'Sri Lanka'],
      orientation: 'landscape',
      image: '/paintings/landscapes/nuwara-eliya-2-version-1.png', versions: 2
  },
  {
      id: '10',
      title: 'Purple Sky',
      medium: 'watercolour',
      date: '',
      dimensions: '',
      description: '',
      tags: ['chaamudi', 'watercolour'],
      products: ['prints'],
      themes: ['space', 'sky'],
      orientation: 'landscape',
      image: '/paintings/landscapes/purple-sky-1-version-1.png'
  },
  {
      id: '11',
      title: 'Sigiriya',
      medium: 'photography',
      date: '',
      dimensions: '',
      description: '',
      tags: ['photography'],
      products: ['prints'],
      themes: ['Sri Lanka', 'nature'],
      orientation: 'landscape',
      image: '/paintings/landscapes/sigiriya-2-version-1.png'
  },
  {
      id: '12',
      title: 'Whimsical Fruits',
      medium: 'watercolour',
      date: '',
      dimensions: '',
      description: '',
      tags: ['chaamudi', 'watercolour'],
      products: ['prints', 'tea-towels'],
      themes: ['nature'],
      featured: true,
      orientation: 'landscape',
      image: '/paintings/landscapes/whimsicle-fruits-1-version-1.png', versions: 2
  },
  {
      id: '13',
      title: 'Winter',
      medium: 'photography',
      date: '',
      dimensions: '',
      description: '',
      tags: ['milindi', 'photography'],
      products: ['prints'],
      themes: ['nature'],
      orientation: 'landscape',
      image: '/paintings/landscapes/winter-1-version-1.png',
      versions: 2
  },
  {
      id: '14',
      title: 'wel yaaya',
      medium: 'photography',
      date: '',
      dimensions: '',
      description: '',
      tags: ['photography'],
      products: ['prints'],
      themes: ['nature', 'Sri Lanka'],
      orientation: 'landscape',
      image: '/paintings/landscapes/yaaya-1-version-1.png'
  },

  // ── Websites ──
  {
      id: '15',
      title: 'Colourful Language',
      medium: 'website',
      date: '',
      dimensions: '',
      description: '',
      tags: ['milindi'],
      products: ['websites'],
      themes: ['pooperthon'],
      url: 'https://colourful-language.github.io/',
      orientation: 'landscape',
      image: '/paintings/landscapes/colourful-lang-1-version-1.png'
  },
  {
      id: '16',
      title: 'Kehel Mala',
      medium: 'website',
      date: '',
      dimensions: '',
      description: '',
      tags: [],
      products: ['websites'],
      themes: [],
      url: 'https://kehel-mala.github.io/',
      orientation: 'landscape',
      image: '/paintings/landscapes/kehel-mala-1-version-1.png', versions: 2
  },
  {
      id: '17',
      title: 'Koho Koho',
      medium: 'website',
      date: '',
      dimensions: '',
      description: '',
      tags: ['milindi'],
      products: ['websites'],
      themes: ['Sri Lanka', 'pooperthon'],
      featured: true,
      url: 'https://koho-koho.github.io/',
      orientation: 'landscape',
      image: '/paintings/landscapes/koho-koho-1-version-1.png', versions: 2
  },
  {
      id: '18',
      title: '#MugLife',
      medium: 'website',
      date: '',
      dimensions: '',
      description: '',
      tags: ['milindi'],
      products: ['websites'],
      themes: ['tea'],
      url: 'https://muglife.github.io/',
      orientation: 'landscape',
      image: '/paintings/landscapes/mug-life-1-version-1.png'
  },

  // ── Comics ──
  {
      id: '19',
      title: 'Our First Road Trip',
      medium: 'comics',
      date: '',
      dimensions: '',
      description: '',
      tags: ['milindi'],
      products: ['zines', 'comics'],
      themes: [],
      orientation: 'landscape',
      image: '/paintings/landscapes/zine-road-trip-1-version-1.png', versions: 5
  },

  // ── Other ──
  {
      id: '20',
      title: 'Dancing Star',
      medium: 'tuft',
      date: '',
      dimensions: '',
      description: '',
      tags: ['chaamudi', 'texture', 'tuft'],
      products: ['prints', 'other'],
      themes: ['sky', 'space'],
      orientation: 'landscape',
      image: '/paintings/landscapes/dancing-star-1-version-1.png', versions: 2
  },
  {
      id: '21',
      title: 'Jingle frogs',
      medium: 'felt',
      date: '',
      dimensions: '',
      description: '',
      tags: ['chaamudi', 'felt'],
      products: ['other'],
      themes: [],
      orientation: 'landscape',
      image: '/paintings/landscapes/frogs-1-version-1.png'
  },
  {
      id: '22',
      title: 'Always watchin',
      medium: 'tuft',
      date: '',
      dimensions: '',
      description: '',
      tags: [],
      products: ['other'],
      themes: [],
      orientation: 'landscape',
      image: '/paintings/landscapes/mili-cushion-1-version-1.png', versions: 2
  },
  {
      id: '23',
      title: 'Mosaic Lamp (tall)',
      medium: 'mosaic',
      date: '',
      dimensions: '',
      description: '',
      tags: ['chaamudi'],
      products: ['other'],
      themes: [],
      orientation: 'landscape',
      image: '/paintings/landscapes/mosaic-lamp-2-version-1.png'
  },

  // ════════════════════════════════════════════════════════════════════════════
  // PORTRAITS
  // ════════════════════════════════════════════════════════════════════════════

  // ── Prints ──
  {
      id: '24',
      title: 'ammi',
      medium: 'acrylic',
      date: '',
      dimensions: '',
      description: '',
      tags: ['milindi', 'acrylic'],
      products: ['prints', 'tea-towels'],
      themes: ['feelings', 'background'],
      orientation: 'portrait',
      image: '/paintings/portraits/background-1-version-1.png'
  },
  {
      id: '25',
      title: 'Radiant Dreamscape',
      medium: 'acrylic',
      date: '',
      dimensions: '',
      description: '',
      tags: ['chaamudi', 'acrylic'],
      products: ['prints'],
      themes: ['background', 'sky'],
      orientation: 'portrait',
      image: '/paintings/portraits/background-2-version-1.png'
  },
  {
      id: '26',
      title: 'Balcony Garden',
      medium: 'digital art',
      date: '',
      dimensions: '',
      description: '',
      tags: ['milindi'],
      products: ['prints'],
      themes: [],
      orientation: 'portrait',
      image: '/paintings/portraits/balcony-garden-1-version-1.png', versions: 2
  },
  {
      id: '27',
      title: 'Black Dog & Black Bird',
      medium: 'pen',
      date: '',
      dimensions: '',
      description: '',
      tags: ['chaamudi', 'pen'],
      products: ['prints'],
      themes: [],
      featured: true,
      orientation: 'portrait',
      image: '/paintings/portraits/black-dog-black-bird-1-version-1.png'
  },
  {
      id: '28',
      title: 'Bored.',
      medium: 'digital art',
      date: '',
      dimensions: '',
      description: '',
      tags: ['chaamudi', 'digital art'],
      products: ['prints'],
      themes: [],
      orientation: 'portrait',
      image: '/paintings/portraits/bored-1-version-1.png'
  },
  {
      id: '29',
      title: 'Carlton Gardens',
      medium: 'photography',
      date: '',
      dimensions: '',
      description: '',
      tags: ['milindi', 'photography'],
      products: ['prints'],
      themes: ['nature'],
      orientation: 'portrait',
      image: '/paintings/portraits/carlton-gardens-1-version-1.png'
  },
  {
      id: '30',
      title: 'Darkness Creeping',
      medium: '',
      date: '',
      dimensions: '',
      description: '',
      tags: ['milindi', 'acrylic'],
      products: ['prints'],
      themes: ['feelings'],
      orientation: 'portrait',
      image: '/paintings/portraits/darkness-creeping-1-version-1.png'
  },
  {
      id: '31',
      title: 'Favourite Things',
      medium: 'watercolour',
      date: '',
      dimensions: '',
      description: '',
      tags: ['milindi', 'watercolour'],
      products: ['prints'],
      themes: ['feelings'],
      orientation: 'portrait',
      image: '/paintings/portraits/doodles-version-1.png', versions: 2
  },
  {
      id: '32',
      title: 'Air',
      medium: 'acrylic',
      date: '',
      dimensions: '',
      description: '',
      tags: ['milindi', 'acrylic'],
      products: ['prints'],
      themes: ['nature', 'elements'],
      orientation: 'portrait',
      image: '/paintings/portraits/elements-1-version-1.png'
  },
  {
      id: '33',
      title: 'Water',
      medium: 'acrylic',
      date: '',
      dimensions: '',
      description: '',
      tags: ['chaamudi', 'acrylic'],
      products: ['prints'],
      themes: ['nature','elements'],
      orientation: 'portrait',
      image: '/paintings/portraits/elements-2-version-1.png'
  },
  {
      id: '34',
      title: 'Feelings',
      medium: 'acrylic',
      date: '',
      dimensions: '',
      description: '',
      tags: ['chaamudi', 'milindi', 'acrylic', 'canvas'],
      products: ['prints'],
      themes: ['feelings'],
      orientation: 'portrait',
      image: '/paintings/portraits/feelings-1-version-1.png', versions: 2
  },
  {
      id: '35',
      title: 'Filter',
      medium: '',
      date: '',
      dimensions: '',
      description: '',
      tags: ['chaamudi'],
      products: ['prints'],
      themes: ['feelings'],
      orientation: 'portrait',
      image: '/paintings/portraits/filter-1-version-1.png'
  },
  // TODO from here!
  {
      id: '36',
      title: 'Fitzroy Gardens',
      medium: 'photography',
      date: '',
      dimensions: '',
      description: '',
      tags: ['photography'],
      products: ['prints'],
      themes: [],
      orientation: 'portrait',
      image: '/paintings/portraits/fitzroy-gardens-1-version-1.png'
  },
  {
      id: '37',
      title: 'Flagstaff Garden',
      medium: 'photography',
      date: '',
      dimensions: '',
      description: '',
      tags: ['photography'],
      products: ['prints'],
      themes: [],
      orientation: 'portrait',
      image: '/paintings/portraits/flagstaff-gardens-1-version-1.png'
  },
  {
      id: '38',
      title: 'Robosia',
      medium: 'watercolour',
      date: '',
      dimensions: '',
      description: '',
      tags: ['chaamudi', 'watercolour'],
      products: ['prints'],
      themes: [],
      orientation: 'portrait',
      image: '/paintings/portraits/flowers-2-version-1.png', versions: 3
  },
  {
      id: '39',
      title: 'Galaxy',
      medium: 'watercolour',
      date: '',
      dimensions: '',
      description: '',
      tags: ['chaamudi', 'watercolour'],
      products: ['prints'],
      themes: ['Space'],
      orientation: 'portrait',
      image: '/paintings/portraits/galaxy-1-version-1.png'
  },
  {
      id: '40',
      title: 'Burnt Out But Survivin',
      medium: 'pencil',
      date: '',
      dimensions: '',
      description: '',
      tags: ['chaamudi', 'pencil'],
      products: ['prints'],
      themes: [],
      featured: true,
      orientation: 'portrait',
      image: '/paintings/portraits/grumpy-1-version-1.png'
  },
  {
      id: '41',
      title: 'Bourke St',
      medium: 'photography',
      date: '',
      dimensions: '',
      description: '',
      tags: ['photography'],
      products: ['prints'],
      themes: [],
      orientation: 'portrait',
      image: '/paintings/portraits/h&m-1-version-1.png'
  },
  {
      id: '42',
      title: 'Sinhala Hoodiya (Sinhala Alphabet)',
      medium: 'pen',
      date: '',
      dimensions: '',
      description: '',
      tags: ['milindi', 'pen'],
      products: ['prints'],
      themes: ['Sri Lanka'],
      orientation: 'portrait',
      image: '/paintings/portraits/hoodiya-1-version-1.png'
  },
  {
      id: '4',
      title: 'Hot Air Balloons',
      medium: 'photography',
      date: '',
      dimensions: '',
      description: '',
      tags: ['photography'],
      products: ['prints'],
      themes: [],
      orientation: 'portrait',
      image: '/paintings/portraits/hot-air-balloons-2-version-1.png',
      versions: 2
  },
  {
      id: '43',
      title: 'In the air',
      medium: 'photography',
      date: '',
      dimensions: '',
      description: '',
      tags: ['photography'],
      products: ['prints'],
      themes: [],
      orientation: 'portrait',
      image: '/paintings/portraits/hot-air-balloons-1-version-1.png',
      versions: 2
  },
  {
      id: '45',
      title: 'Hour Glass',
      medium: '',
      date: '',
      dimensions: '',
      description: '',
      tags: [],
      products: ['prints'],
      themes: [],
      orientation: 'portrait',
      image: '/paintings/portraits/hour-glass-1-version-1.png'
  },
  {
      id: '46',
      title: 'Darkest timeline',
      medium: 'pencil',
      date: '',
      dimensions: '',
      description: '',
      tags: ['milindi', 'pencil'],
      products: ['prints'],
      themes: [],
      orientation: 'portrait',
      image: '/paintings/portraits/mind-map-2-version-1.png'
  },
  {
      id: '47',
      title: 'Mornington',
      medium: 'photography',
      date: '',
      dimensions: '',
      description: '',
      tags: ['photography'],
      products: ['prints'],
      themes: [],
      orientation: 'portrait',
      image: '/paintings/portraits/mornington-1-version-1.png'
  },
  {
      id: '48',
      title: 'Hearth',
      medium: 'photography',
      date: '',
      dimensions: '',
      description: '',
      tags: ['chaamudi', 'photography'],
      products: ['prints'],
      themes: ['nature'],
      orientation: 'portrait',
      image: '/paintings/portraits/natives-1-version-1.png'
  },
  {
      id: '49',
      title: 'Natives at Botanic Gardens I',
      medium: 'watercolour',
      date: '',
      dimensions: '',
      description: '',
      tags: ['chaamudi', 'watercolour'],
      products: ['prints'],
      themes: ['nature'],
      orientation: 'portrait',
      image: '/paintings/portraits/natives-2-version-1.png'
  },
  {
      id: '50',
      title: 'Natives at Botanic Gardens II',
      medium: 'watercolour',
      date: '',
      dimensions: '',
      description: '',
      tags: ['chaamudi', 'watercolour'],
      products: ['prints'],
      themes: ['nature'],
      orientation: 'portrait',
      image: '/paintings/portraits/natives-3-version-1.png', versions: 2
  },
  {
      id: '51',
      title: 'Natives at Botanic Gardens III',
      medium: 'watercolour',
      date: '',
      dimensions: '',
      description: '',
      tags: ['milindi', 'watercolour'],
      products: ['prints'],
      themes: ['nature'],
      featured: true,
      orientation: 'portrait',
      image: '/paintings/portraits/natives-4-version-1.png'
  },
  {
      id: '52',
      title: 'Nuwara Eliya',
      medium: 'photography',
      date: '',
      dimensions: '',
      description: '',
      tags: ['milindi', 'chaamudi', 'photography'],
      products: ['prints'],
      themes: ['Sri Lanka'],
      featured: true,
      orientation: 'portrait',
      image: '/paintings/portraits/nuwara-eliya-1-version-1.png', versions: 5
  },
  {
      id: '53',
      title: 'Dancer',
      medium: 'acrylic',
      date: '',
      dimensions: '',
      description: '',
      tags: ['chaamudi', 'acrylic'],
      products: ['prints'],
      themes: [],
      featured: true,
      orientation: 'portrait',
      image: '/paintings/portraits/paint-and-sip-1-version-1.png'
  },
  {
      id: '54',
      title: 'Parrots',
      medium: '',
      date: '',
      dimensions: '',
      description: '',
      tags: [],
      products: ['prints'],
      themes: [],
      orientation: 'portrait',
      image: '/paintings/portraits/parrots-1-version-1.png', versions: 3
  },
  {
      id: '55',
      title: 'Modern Moonstone',
      medium: 'acrylic',
      date: '',
      dimensions: '',
      description: '',
      tags: ['milindi', 'watercolour'],
      products: ['prints', 'tea-towels'],
      themes: [],
      orientation: 'portrait',
      image: '/paintings/portraits/patterns-1-version-1.png', versions: 2
  },
  {
      id: '56',
      title: 'Pinnawala',
      medium: 'photography',
      date: '',
      dimensions: '',
      description: '',
      tags: ['photography'],
      products: ['prints'],
      themes: [],
      orientation: 'portrait',
      image: '/paintings/portraits/pinnawala-1-version-1.png'
  },
  {
      id: '57',
      title: 'Planet',
      medium: 'texture',
      date: '',
      dimensions: '',
      description: '',
      tags: ['chaamudi', 'texture'],
      products: ['prints'],
      themes: ['Space'],
      orientation: 'portrait',
      image: '/paintings/portraits/planet-1-version-1.png'
  },
  {
      id: '58',
      title: 'Queen of the Night',
      medium: 'chalk',
      date: '',
      dimensions: '',
      description: '',
      tags: ['chaamudi', 'chalk'],
      products: ['prints', 'tea-towels'],
      themes: [],
      featured: true,
      orientation: 'portrait',
      image: '/paintings/portraits/princess-blue-1-version-1.png'
  },
  {
      id: '59',
      title: 'Screaming Tree',
      medium: 'photography',
      date: '',
      dimensions: '',
      description: '',
      tags: ['photography'],
      products: ['prints'],
      themes: [],
      orientation: 'portrait',
      image: '/paintings/landscapes/screaming-tree-1-version-1.png'
  },
  {
      id: '60',
      title: 'Shapes I',
      medium: 'pen',
      date: '',
      dimensions: '',
      description: '',
      tags: ['chaamudi', 'pen'],
      products: ['prints'],
      themes: [],
      orientation: 'portrait',
      image: '/paintings/portraits/shapes-1-version-1.png'
  },
  {
      id: '61',
      title: 'Shapes II',
      medium: 'pen',
      date: '',
      dimensions: '',
      description: '',
      tags: ['chaamudi', 'pen'],
      products: ['prints'],
      themes: [],
      orientation: 'portrait',
      image: '/paintings/portraits/shapes-framed-1-version-1.png'
  },
  {
      id: '62',
      title: 'Sigiriya',
      medium: 'photography',
      date: '',
      dimensions: '',
      description: '',
      tags: ['photography'],
      products: ['prints'],
      themes: [],
      orientation: 'portrait',
      image: '/paintings/portraits/sigiriya-1-version-1.png'
  },
  {
      id: '63',
      title: 'Myosotis : : Silksong OC',
      medium: 'watercolour',
      date: '',
      dimensions: '',
      description: '',
      tags: ['chaamudi', 'watercolour'],
      products: ['prints'],
      themes: ['Silksong'],
      orientation: 'portrait',
      image: '/paintings/portraits/silksong-1-version-1.png'
  },
  {
      id: '64',
      title: 'Ayu : : Silksong OC',
      medium: 'watercolour',
      date: '',
      dimensions: '',
      description: '',
      tags: ['milindi', 'watercolour'],
      products: ['prints'],
      themes: ['Silksong'],
      orientation: 'portrait',
      image: '/paintings/portraits/silksong-2-version-1.png'
  },
  {
      id: '65',
      title: 'Too Too : : Silksong OC',
      medium: 'texture',
      date: '',
      dimensions: '',
      description: '',
      tags: ['guest star', 'texture'],
      products: ['prints'],
      themes: ['Silksong'],
      orientation: 'portrait',
      image: '/paintings/portraits/silksong-3-version-1.png', versions: 2
  },
  {
      id: '66',
      title: 'Horney-poo shaws!',
      medium: 'pencil',
      date: '',
      dimensions: '',
      description: '',
      tags: ['milindi', 'pencil'],
      products: ['prints'],
      themes: ['Silksong'],
      orientation: 'portrait',
      image: '/paintings/portraits/silksong-4-version-1.png', versions: 2
  },
  {
      id: '67',
      title: 'Alien',
      medium: 'texture',
      date: '',
      dimensions: '',
      description: '',
      tags: ['chaamudi', 'texture'],
      products: ['prints'],
      themes: ['Space'],
      orientation: 'portrait',
      image: '/paintings/portraits/space-alien-1-version-1.png'
  },
  {
      id: '68',
      title: 'Sparkles',
      medium: 'pen',
      date: '',
      dimensions: '',
      description: '',
      tags: ['chaamudi', 'pen'],
      products: ['prints'],
      themes: [],
      orientation: 'portrait',
      image: '/paintings/portraits/sparkles-1-version-1.png', versions: 4
  },
  {
      id: '69',
      title: 'Autumn',
      medium: 'photography',
      date: '',
      dimensions: '',
      description: '',
      tags: ['milindi', 'photography'],
      products: ['prints'],
      themes: ['nature'],
      orientation: 'portrait',
      image: '/paintings/portraits/spider-park-1-version-1.png'
  },
  {
      id: '70',
      title: 'Pearl of the Indian Ocean',
      medium: 'pen',
      date: '',
      dimensions: '',
      description: '',
      tags: ['chaamudi', 'pen'],
      products: ['prints'],
      themes: ['Sri Lanka'],
      orientation: 'portrait',
      image: '/paintings/portraits/srilanka-1-version-1.png'
  },
  {
      id: '72',
      title: 'Tea Cup I',
      medium: 'watercolour',
      date: '',
      dimensions: '',
      description: '',
      tags: ['chaamudi', 'watercolour'],
      products: ['prints'],
      themes: ['Tea'],
      orientation: 'portrait',
      image: '/paintings/portraits/tea-party-1-version-1.png'
  },
  {
      id: '73',
      title: 'Tea Cup II - Factorials',
      medium: 'watercolour',
      date: '',
      dimensions: '',
      description: '',
      tags: ['guest star', 'watercolour'],
      products: ['prints'],
      themes: ['Tea'],
      orientation: 'portrait',
      image: '/paintings/portraits/tea-party-2-version-1.png'
  },
  {
      id: '74',
      title: 'Tea Cup III',
      medium: 'watercolour',
      date: '',
      dimensions: '',
      description: '',
      tags: ['milindi', 'watercolour'],
      products: ['prints'],
      themes: ['Tea'],
      orientation: 'portrait',
      image: '/paintings/portraits/tea-party-3-version-1.png'
  },
  {
      id: '75',
      title: 'Tea Party',
      medium: 'watercolour',
      date: '',
      dimensions: '',
      description: '',
      tags: ['milindi', 'chaamudi', 'guest star', 'watercolour', 'digital art'],
      products: ['prints'],
      themes: ['Tea'],
      orientation: 'portrait',
      image: '/paintings/portraits/tea-party-4-version-1.png', versions: 2
  },
  {
      id: '76',
      title: 'Perpetual third wheel',
      medium: 'pencil',
      date: '',
      dimensions: '',
      description: '',
      tags: ['milindi', 'pencil'],
      products: ['prints'],
      themes: [],
      orientation: 'portrait',
      image: '/paintings/portraits/third-wheel-1-version-1.png', versions: 2
  },
  {
      id: '77',
      title: 'Chilli',
      medium: 'watercolour',
      date: '',
      dimensions: '',
      description: '',
      tags: ['milindi', 'watercolour'],
      products: ['prints', 'tea-towels'],
      themes: [],
      orientation: 'portrait',
      image: '/paintings/portraits/trees-1-version-1.png'
  },
  {
      id: '78',
      title: 'Pal path',
      medium: 'watercolour',
      date: '',
      dimensions: '',
      description: '',
      tags: ['chaamudi', 'watercolour'],
      products: ['prints', 'tea-towels'],
      themes: [],
      orientation: 'portrait',
      image: '/paintings/portraits/trees-2-version-1.png', versions: 2
  },
  {
      id: '79',
      title: 'Imposter',
      medium: 'watercolour',
      date: '',
      dimensions: '',
      description: '',
      tags: ['milindi', 'watercolour'],
      products: ['prints', 'tea-towels'],
      themes: [],
      featured: true,
      orientation: 'portrait',
      image: '/paintings/portraits/whimsicle-fruits-2-version-1.png', versions: 2
  },

  // ── Zines ──
  {
      id: '80',
      title: '#GuerillaTea I',
      medium: 'zines',
      date: '',
      dimensions: '',
      description: '',
      tags: [],
      products: ['zines'],
      themes: ['Tea'],
      orientation: 'portrait',
      image: '/paintings/portraits/zine-guerilla-tea-1-version-1.png', variants: ['/paintings/portraits/zine-guerilla-tea-1-version-2.png', '/paintings/portraits/zine-guerilla-tea-1-version-3.png', '/paintings/portraits/zine-guerilla-tea-1-version-4.png', '/paintings/portraits/zine-guerilla-tea-1-version-5.png', '/paintings/portraits/zine-guerilla-tea-1-version-6.png', '/paintings/portraits/zine-guerilla-tea-1-version-7.png', '/paintings/portraits/zine-guerilla-tea-1-version-8.png', '/paintings/portraits/zine-guerilla-tea-1-version-9.png', '/paintings/landscapes/zine-1-version-1.png', '/paintings/landscapes/zine-1-version-2.png']
  },
  {
      id: '81',
      title: '#GuerillaTea II',
      medium: 'zines',
      date: '',
      dimensions: '',
      description: '',
      tags: [],
      products: ['zines'],
      themes: ['Tea'],
      orientation: 'portrait',
      image: '/paintings/portraits/zine-guerilla-tea-2-version-1.png', variants: ['/paintings/portraits/zine-guerilla-tea-2-version-2.png', '/paintings/portraits/zine-guerilla-tea-2-version-3.png', '/paintings/portraits/zine-guerilla-tea-2-version-4.png', '/paintings/portraits/zine-guerilla-tea-2-version-5.png', '/paintings/portraits/zine-guerilla-tea-2-version-6.png', '/paintings/portraits/zine-guerilla-tea-2-version-7.png', '/paintings/portraits/zine-guerilla-tea-2-version-8.png', '/paintings/portraits/zine-guerilla-tea-2-version-9.png', '/paintings/landscapes/zine-1-version-1.png', '/paintings/landscapes/zine-1-version-2.png']
  },
  {
      id: '82',
      title: '#GuerillaTea III',
      medium: 'zines',
      date: '',
      dimensions: '',
      description: '',
      tags: [],
      products: ['zines'],
      themes: ['Tea'],
      orientation: 'portrait',
      image: '/paintings/portraits/zine-guerilla-tea-3-version-1.png', variants: ['/paintings/portraits/zine-guerilla-tea-3-version-2.png', '/paintings/portraits/zine-guerilla-tea-3-version-3.png', '/paintings/portraits/zine-guerilla-tea-3-version-4.png', '/paintings/portraits/zine-guerilla-tea-3-version-5.png', '/paintings/portraits/zine-guerilla-tea-3-version-6.png', '/paintings/portraits/zine-guerilla-tea-3-version-7.png', '/paintings/portraits/zine-guerilla-tea-3-version-8.png', '/paintings/portraits/zine-guerilla-tea-3-version-9.png', '/paintings/landscapes/zine-1-version-1.png', '/paintings/landscapes/zine-1-version-2.png']
  },
  {
      id: '83',
      title: '#GuerillaTea IV',
      medium: 'zines',
      date: '',
      dimensions: '',
      description: '',
      tags: [],
      products: ['zines'],
      themes: ['Tea'],
      orientation: 'portrait',
      image: '/paintings/portraits/zine-guerilla-tea-4-version-1.png', variants: ['/paintings/portraits/zine-guerilla-tea-4-version-2.png', '/paintings/portraits/zine-guerilla-tea-4-version-3.png', '/paintings/portraits/zine-guerilla-tea-4-version-4.png', '/paintings/portraits/zine-guerilla-tea-4-version-5.png', '/paintings/portraits/zine-guerilla-tea-4-version-6.png', '/paintings/portraits/zine-guerilla-tea-4-version-7.png', '/paintings/portraits/zine-guerilla-tea-4-version-8.png', '/paintings/portraits/zine-guerilla-tea-4-version-9.png', '/paintings/landscapes/zine-1-version-1.png', '/paintings/landscapes/zine-1-version-2.png']
  },
  {
      id: '84',
      title: '#GuerillaTea V',
      medium: 'zines',
      date: '',
      dimensions: '',
      description: '',
      tags: [],
      products: ['zines'],
      themes: ['Tea'],
      orientation: 'portrait',
      image: '/paintings/portraits/zine-guerilla-tea-5-version-1.png', variants: ['/paintings/portraits/zine-guerilla-tea-5-version-2.png', '/paintings/portraits/zine-guerilla-tea-5-version-3.png', '/paintings/portraits/zine-guerilla-tea-5-version-4.png', '/paintings/portraits/zine-guerilla-tea-5-version-5.png', '/paintings/portraits/zine-guerilla-tea-5-version-6.png', '/paintings/portraits/zine-guerilla-tea-5-version-7.png', '/paintings/portraits/zine-guerilla-tea-5-version-8.png', '/paintings/portraits/zine-guerilla-tea-5-version-9.png', '/paintings/landscapes/zine-1-version-1.png', '/paintings/landscapes/zine-1-version-2.png']
  },
  {
      id: '85',
      title: '#GuerillaTea VI',
      medium: 'zines',
      date: '',
      dimensions: '',
      description: '',
      tags: [],
      products: ['zines'],
      themes: ['Tea'],
      orientation: 'portrait',
      image: '/paintings/portraits/zine-guerilla-tea-6-version-1.png', variants: ['/paintings/portraits/zine-guerilla-tea-6-version-2.png', '/paintings/portraits/zine-guerilla-tea-6-version-3.png', '/paintings/portraits/zine-guerilla-tea-6-version-4.png', '/paintings/portraits/zine-guerilla-tea-6-version-5.png', '/paintings/portraits/zine-guerilla-tea-6-version-6.png', '/paintings/portraits/zine-guerilla-tea-6-version-7.png', '/paintings/portraits/zine-guerilla-tea-6-version-8.png', '/paintings/portraits/zine-guerilla-tea-6-version-9.png', '/paintings/landscapes/zine-1-version-1.png', '/paintings/landscapes/zine-1-version-2.png']
  },
  {
      id: '86',
      title: '#GuerillaTea VII',
      medium: 'zines',
      date: '',
      dimensions: '',
      description: '',
      tags: [],
      products: ['zines'],
      themes: ['Tea'],
      orientation: 'portrait',
      image: '/paintings/portraits/zine-guerilla-tea-7-version-1.png', variants: ['/paintings/portraits/zine-guerilla-tea-7-version-2.png', '/paintings/portraits/zine-guerilla-tea-7-version-3.png', '/paintings/portraits/zine-guerilla-tea-7-version-4.png', '/paintings/portraits/zine-guerilla-tea-7-version-5.png', '/paintings/portraits/zine-guerilla-tea-7-version-6.png', '/paintings/portraits/zine-guerilla-tea-7-version-7.png', '/paintings/portraits/zine-guerilla-tea-7-version-8.png', '/paintings/portraits/zine-guerilla-tea-7-version-9.png', '/paintings/landscapes/zine-1-version-1.png', '/paintings/landscapes/zine-1-version-2.png']
  },
  {
      id: '87',
      title: 'To my special someone . . . .',
      medium: '',
      date: '',
      dimensions: '',
      description: '',
      tags: [],
      products: ['zines'],
      themes: [],
      orientation: 'portrait',
      image: '/paintings/portraits/zine-special-someone-1-version-1.png', versions: 9
  },

  // ── Comics ──
  {
      id: '88',
      title: 'Good day',
      medium: 'comics',
      date: '',
      dimensions: '',
      description: '',
      tags: [],
      products: ['comics'],
      themes: [],
      orientation: 'portrait',
      image: '/paintings/portraits/comic-mili-alone-1-version-1.png'
  },
  {
      id: '89',
      title: '"Productive" Saturday',
      medium: 'comics',
      date: '',
      dimensions: '',
      description: '',
      tags: [],
      products: ['comics'],
      themes: [],
      orientation: 'portrait',
      image: '/paintings/portraits/comic-productive-sat-1-version-1.png'
  },

  // ── Other ──
  {
      id: '90',
      title: 'Lights',
      medium: 'glass paint',
      date: '',
      dimensions: '',
      description: '',
      tags: ['chaamudi', 'milindi'],
      products: ['other'],
      themes: [],
      orientation: 'portrait',
      image: '/paintings/portraits/glass-1-version-1.png', versions: 2
  },
  {
      id: '91',
      title: 'Light Frame',
      medium: 'pencil',
      date: '',
      dimensions: '',
      description: '',
      tags: [],
      products: ['other'],
      themes: [],
      orientation: 'portrait',
      image: '/paintings/portraits/light-frame-1-version-1.png'
  },
  {
      id: '92',
      title: 'Masquerade Masks',
      medium: 'acrylic',
      date: '',
      dimensions: '',
      description: '',
      tags: ['milindi', 'chaamudi', 'acrylic'],
      products: ['other'],
      themes: [],
      featured: true,
      orientation: 'portrait',
      image: '/paintings/portraits/masks-1-version-1.png', versions: 9
  },
  {
      id: '93',
      title: 'Mosaic Lamp',
      medium: 'mosaic',
      date: '',
      dimensions: '',
      description: '',
      tags: [],
      products: ['other'],
      themes: [],
      orientation: 'portrait',
      image: '/paintings/portraits/mosaic-lamp-1-version-1.png', versions: 2
  },
  {
      id: '94',
      title: 'Slug',
      medium: 'origami',
      date: '',
      dimensions: '',
      description: '',
      tags: ['milindi'],
      products: ['other'],
      themes: [],
      orientation: 'portrait',
      image: '/paintings/portraits/origami-1-version-1.png', versions: 2
  },
  {
      id: '95',
      title: 'Origami Flower',
      medium: 'origami',
      date: '',
      dimensions: '',
      description: '',
      tags: [],
      products: ['prints', 'other'],
      themes: [],
      orientation: 'portrait',
      image: '/paintings/portraits/origami-flower-1-version-1.png', versions: 2
  },
  {
      id: '96',
      title: 'Tea Spoon',
      medium: 'wood',
      date: '',
      dimensions: '',
      description: '',
      tags: ['milindi'],
      products: ['other'],
      themes: ['Tea'],
      orientation: 'portrait',
      image: '/paintings/portraits/spoon-1-version-1.png'
  },
  {
      id: '97',
      title: 'T-Shirt Glow',
      medium: 'glow in the dark paint',
      date: '',
      dimensions: '',
      description: '',
      tags: [],
      products: ['other'],
      themes: [],
      orientation: 'portrait',
      image: '/paintings/portraits/t-shirt-glow-1-version-1.png', versions: 2
  },
];
