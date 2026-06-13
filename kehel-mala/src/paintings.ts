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
  { id: 'glassware', label: 'Glassware' },
  { id: 'origami', label: 'Origami' },
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

// The ARRAY ORDER below is the "Featured" sort order — grouped by theme.
// `medium`, `date`, and `tags` are intentionally left blank for now — add them per
// piece. Portraits live in /paintings/portraits, landscapes in /paintings/landscapes.
//
// `products` defaults to ['prints']; the seeds below are a starting point — edit a
// piece's `products` list to re-file it (or list several, e.g. ['prints','tea-towels']
// for a design sold as both). `themes` are yours to fill in; a few obvious ones are
// seeded as examples.
export const paintings: Painting[] = [

  // Featured (shown on the landing page; flagged with `featured: true`)
  { id: '6', title: 'Sparkles', orientation: 'portrait', medium: "pen", tags:["chaamudi", "pen"], products: ['prints'], featured: true, image: '/paintings/portraits/sparkles-1-version-1.png', versions: 4 },

  { id: '29', title: 'Dancer', orientation: 'portrait', medium: "acrylic", tags:["chaamudi", "acrylic"], products: ['prints'], featured: true, image: '/paintings/portraits/paint-and-sip-1-version-1.png' },

  { id: '35', title: 'Whimsical Fruits', orientation: 'landscape', medium: "watercolour", tags:["chaamudi", "watercolour"], products: ['prints', 'tea-towels'], featured: true, image: '/paintings/landscapes/whimsicle-fruits-1-version-1.png', versions: 2 },

  { id: '57', title: 'Masquerade Masks', orientation: 'portrait', medium: "acrylic", tags:["milindi", "chaamudi", "acrylic"], products: ['prints'], featured: true, image: '/paintings/portraits/masks-1-version-1.png', versions: 9 },

  { id: '12', title: 'Dancing Star', orientation: 'landscape', medium: "watercolour", tags:["chaamudi", "watercolour"], products: ['prints'], featured: true, image: '/paintings/landscapes/dancing-star-1-version-1.png' },

  { id: '22', title: 'Queen of the Night', orientation: 'portrait', medium: "chalk", tags:["chaamudi", "chalk"], products: ['prints'], featured: true, image: '/paintings/portraits/princess-blue-1-version-1.png' },

  { id: '36', title: 'Imposter', orientation: 'portrait', medium: "watercolour", tags:["milindi", "watercolour"], products: ['prints'], featured: true, image: '/paintings/portraits/whimsicle-fruits-2-version-1.png', versions: 2 },

  { id: '55', title: 'Nuwara Eliya', orientation: 'portrait', medium: "photography", tags:["milindi", "chaamudi", "photography"], products: ['prints'], themes: ['Sri Lanka'], featured: true, image: '/paintings/portraits/nuwara-eliya-1-version-1.png', versions: 2},

  { id: '37', title: 'Burnt Out But Survivin', orientation: 'portrait', medium: "pencil", tags:["chaamudi", "pencil"], products: ['prints'], featured: true, image: '/paintings/portraits/grumpy-1-version-1.png' },

  { id: '7', title: 'Sepalika', orientation: 'landscape', medium: "watercolour", tags:["milindi", "watercolour"], products: ['prints'], featured: true, image: '/paintings/landscapes/flowers-1-version-1.png', versions: 2 },

  { id: '50', title: 'Black Dog & Black Bird', orientation: 'portrait', medium: "pen", tags:["chaamudi", "pen"], products: ['prints'], featured: true, image: '/paintings/portraits/black-dog-black-bird-1-version-1.png'},

  { id: '40', title: 'Natives at Botanic Gardens III', orientation: 'portrait', medium: "watercolour", tags:["milindi", "watercolour"], products: ['prints'], themes: ['Nature'], featured: true, image: '/paintings/portraits/natives-4-version-1.png'},

  { id: '46', title: 'Koho Koho', orientation: 'landscape', products: ['websites'], url: 'https://koho-koho.github.io/', tags: ['milindi'], featured: true, image: '/paintings/landscapes/koho-koho-1-version-1.png', versions: 2 },

  // Here are the normals
  { id: '1', title: 'Ammi', orientation: 'portrait', medium: "acrylic", tags:["milindi", "acrylic"], products: ['prints'], image: '/paintings/portraits/background-1-version-1.png' },
  { id: '2', title: 'Radiant Dreamscape', orientation: 'portrait', medium: "acrylic", tags:["chaamudi", "acrylic"], products: ['prints'], image: '/paintings/portraits/background-2-version-1.png' },

  { id: '3', title: 'Air', orientation: 'portrait', medium: "acrylic", tags:["milindi", "acrylic"], products: ['prints'], image: '/paintings/portraits/elements-1-version-1.png' },
  { id: '4', title: 'Water', orientation: 'portrait', medium: "acrylic", tags:["chaamudi", "acrylic"], products: ['prints'], image: '/paintings/portraits/elements-2-version-1.png' },

  { id: '5', title: 'Modern Moonstone', orientation: 'portrait', medium: "acrylic", tags:["milindi", "watercolour"], products: ['prints'], image: '/paintings/portraits/patterns-1-version-1.png', versions: 2 },

  { id: '8', title: 'Robosia', orientation: 'portrait', medium: "watercolour", tags:["chaamudi", "watercolour"], products: ['prints'], image: '/paintings/portraits/flowers-2-version-1.png', versions: 3 },

  { id: '9', title: 'Chilli', orientation: 'portrait', medium: "watercolour", tags:["milindi", "watercolour"], products: ['prints'], image: '/paintings/portraits/trees-1-version-1.png' },
  { id: '10', title: 'Pal path', orientation: 'portrait', medium: "watercolour", tags:["chaamudi", "watercolour"], products: ['prints'], image: '/paintings/portraits/trees-2-version-1.png' },
  { id: '11', title: 'Jingle frogs', orientation: 'landscape', medium: "felt", tags:["chaamudi"], products: ['other'], image: '/paintings/landscapes/frogs-1-version-1.png' },

  { id: '13', title: 'Galaxy', orientation: 'portrait', medium: "watercolour", tags:["chaamudi", "watercolour"], products: ['prints'], themes: ['Space'], image: '/paintings/portraits/galaxy-1-version-1.png' },
  { id: '14', title: 'Planet', orientation: 'portrait', medium: "texture", tags:["chaamudi", "texture"], products: ['prints'], themes: ['Space'], image: '/paintings/portraits/planet-1-version-1.png' },
  { id: '15', title: 'Alien', orientation: 'portrait', medium: "texture", tags:["chaamudi", "texture"], products: ['prints'], themes: ['Space'], image: '/paintings/portraits/space-alien-1-version-1.png' },

  { id: '16', title: 'Mind Map', orientation: 'landscape', medium: "watercolour", tags:["chaamudi", "watercolour", "pen"], products: ['prints'], image: '/paintings/landscapes/mind-map-1-version-1.png' },
  { id: '17', title: 'Darkest timeline', orientation: 'portrait', medium: "pencil", tags:["milindi", "pencil"], products: ['prints'], image: '/paintings/portraits/mind-map-2-version-1.png' },

  { id: '18', title: 'Hearth', orientation: 'portrait', medium: "photography", tags:["chaamudi", "photography"], products: ['prints'], themes: ['Nature'], image: '/paintings/portraits/natives-1-version-1.png' },
  { id: '19', title: 'Natives at Botanic Gardens I', orientation: 'portrait', medium: "watercolour", tags:["chaamudi", "watercolour"], products: ['prints'], themes: ['Nature'], image: '/paintings/portraits/natives-2-version-1.png' },
  { id: '20', title: 'Natives at Botanic Gardens II', orientation: 'portrait', medium: "watercolour", tags:["chaamudi", "watercolour"], products: ['prints'], themes: ['Nature'], image: '/paintings/portraits/natives-3-version-1.png', versions: 2 },

  { id: '21', title: 'Pearl of the Indian Ocean', orientation: 'portrait', medium: "pen", tags:["chaamudi", "pen"], products: ['prints'], themes: ['Sri Lanka'], image: '/paintings/portraits/srilanka-1-version-1.png'},

  { id: '23', title: 'Myosotis : : Silksong OC', orientation: 'portrait', medium: "watercolour", tags:["chaamudi", "watercolour"], products: ['prints'], themes: ['Silksong'], image: '/paintings/portraits/silksong-1-version-1.png' },
  { id: '24', title: 'Ayu : : Silksong OC', orientation: 'portrait', medium: "watercolour", tags:["milindi", "watercolour"], products: ['prints'], themes: ['Silksong'], image: '/paintings/portraits/silksong-2-version-1.png' },
  { id: '25', title: 'Too Too : : Silksong OC',orientation: 'portrait', medium: "texture", tags:["guest star", "texture"], products: ['prints'], themes: ['Silksong'], image: '/paintings/portraits/silksong-3-version-1.png', versions: 2 },
  { id: '26', title: 'Horney-poo shaws!', orientation: 'portrait', medium: "pencil", tags:["milindi", "pencil"], products: ['prints'], themes: ['Silksong'], image: '/paintings/portraits/silksong-4-version-1.png', versions: 2 },

  { id: '27', title: 'Slug', orientation: 'portrait', medium: "origami", tags:["milindi"], products: ['origami'], image: '/paintings/portraits/origami-1-version-1.png', versions: 2 },
  { id: '28', title: 'Favourite Things', medium: "watercolour", tags:["milindi", "watercolour"], products: ['prints'], orientation: 'portrait', image: '/paintings/portraits/doodles-version-1.png', versions: 2 },

  { id: '30', title: 'Tea Spoon', orientation: 'portrait', medium: "wood", tags:["milindi"], products: ['other'], themes: ['Tea'], image: '/paintings/portraits/spoon-1-version-1.png' },

  { id: '31', title: 'Tea Cup I', orientation: 'portrait', medium: "watercolour", tags:["chaamudi", "watercolour"], products: ['prints'], themes: ['Tea'], image: '/paintings/portraits/tea-party-1-version-1.png' },
  { id: '32', title: 'Tea Cup II - Factorials', orientation: 'portrait', medium: "watercolour", tags:["guest star", "watercolour"], products: ['prints'], themes: ['Tea'], image: '/paintings/portraits/tea-party-2-version-1.png' },
  { id: '33', title: 'Tea Cup III', orientation: 'portrait', medium: "watercolour", tags:["milindi", "watercolour"], products: ['prints'], themes: ['Tea'], image: '/paintings/portraits/tea-party-3-version-1.png' },
  { id: '34', title: 'Tea Party', orientation: 'portrait', medium: "watercolour", tags:["milindi", "chaamudi", "guest star", "watercolour"], products: ['prints'], themes: ['Tea'], image: '/paintings/portraits/tea-party-4-version-1.png', versions: 2 },

  { id: '38', title: 'Feelings', orientation: 'portrait', medium: "acrylic", tags:["chaamudi", "milindi", "acrylic"], products: ['prints'], image: '/paintings/portraits/feelings-1-version-1.png', versions: 2},
  { id: '39', title: 'Lights', orientation: 'portrait', medium: "glass paint", tags:["chaamudi", "milindi"], products: ['glassware'], image: '/paintings/portraits/glass-1-version-1.png', versions: 2 },

  { id: '41', title: 'Sinhala Hoodiya (Sinhala Alphabet)', orientation: 'portrait', medium: "pen", tags:["milindi", "pen"], products: ['prints'], themes: ['Sri Lanka'], image: '/paintings/portraits/hoodiya-1-version-1.png' },
  { id: '42', title: 'Perpetual third wheel', orientation: 'portrait', medium: "pencil", tags:["milindi", "pencil"], products: ['prints'], image: '/paintings/portraits/third-wheel-1-version-1.png', versions: 2},

  { id: '43', title: 'Carlton Gardens', orientation: 'portrait', medium: "photography", tags:["milindi", "photography"], products: ['prints'], themes: ['Nature'], image: '/paintings/portraits/carlton-gardens-1-version-1.png'},
  { id: '44', title: 'Sunrise Through The Years', orientation: 'landscape', medium: "photography", tags:["milindi", "photography"], products: ['prints'], image: '/paintings/portraits/morning-1-version-1.png', versions: 4},
  { id: '54', title: 'Autumn', orientation: 'portrait', medium: "photography", tags:["milindi", "photography"], products: ['prints'], themes: ['Nature'], image: '/paintings/portraits/spider-park-1-version-1.png'},
  { id: '56', title: 'Whisps in the wind', orientation: 'landscape', medium: "photography", tags:["milindi", "photography"], products: ['prints'], image: '/paintings/landscapes/cloud-1-version-1.png', versions: 3},
  { id: '58', title: 'Winter', orientation: 'landscape', medium: "photography", tags:["milindi", "photography"], products: ['prints'], image: '/paintings/landscapes/winter-1-version-1.png', versions: 2},


  { id: '51', title: 'Shapes I', orientation: 'portrait', medium: "pen", tags:["chaamudi", "pen"], products: ['prints'], image: '/paintings/portraits/shapes-1-version-1.png'},
  { id: '52', title: 'Shapes II', orientation: 'portrait', medium: "pen", tags:["chaamudi", "pen"], products: ['prints'], image: '/paintings/portraits/shapes-framed-1-version-1.png'},
  { id: '53', title: 'Bored.', orientation: 'portrait', medium: "digital art", tags:["chaamudi", "digital art"], products: ['prints'], image: '/paintings/portraits/bored-1-version-1.png'},

  // ---------------------------------------------------------------------------
  // Websites — set `products: ['websites']` and `url` to the live site. `image` is a
  // screenshot/thumbnail (drop it in /public/websites/ and reference it here).
  // The detail page embeds the URL in an iframe with an "Open site ↗" fallback.
  { id: '45', title: 'Colourful Language', orientation: 'landscape', products: ['websites'], url: 'https://colourful-language.github.io/', tags: ['milindi'], image: '/paintings/landscapes/colourful-lang-1-version-1.png' },
  { id: '47', title: '#MugLife', orientation: 'landscape', products: ['websites'], url: 'https://muglife.github.io/', tags: ['milindi'], image: '/paintings/landscapes/mug-life-1-version-1.png' },


  // Zines — set `products: ['zines']`. Use `versions` for multi-page spreads.
  { id: '48', title: '#GuerillaTea', orientation: 'landscape', products: ['zines'], tags: ['milindi'], themes: ['Tea'], image: '/paintings/landscapes/zine-1-version-1.png', versions: 2 },
  { id: '49', title: 'To my special someone . . . .', orientation: 'portrait', products: ['zines'], tags: ['chaamudi'], image: '/paintings/portraits/zine-2-version-1.png'},

  // Tea Towels — set `products: ['tea-towels']`. (None yet — the section shows empty.)
  // { id: '60', title: 'Banana Flower Tea Towel', orientation: 'portrait', products: ['tea-towels'], tags: ['milindi'], themes: ['Tea'], image: '/paintings/portraits/tea-towel-1-version-1.png' },

  // Glassware — set `products: ['glassware']` (e.g. the 'Lights' glass-paint piece).
  // Other — felt, wood, clay, etc. — set `products: ['other']`.

];
