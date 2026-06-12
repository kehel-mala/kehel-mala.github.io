export type Orientation = 'landscape' | 'portrait';

// The fixed vocabulary of tags used for filtering the gallery.
export const TAGS = [
  'milindi',
  'chaamudi',
  'guest star',
  'watercolour',
  'oil paint',
  'acrylic',
  'pencil',
  'pen',
  'texture',
  'photography',
  'felt',
  'origami',
  'wood',
  'glass paint',
  'clay',
  'zine',
  'website',
  'digital art',
  'chalk',
] as const;

export type Tag = (typeof TAGS)[number];

// The Gallery "type" sections, shown in the Gallery nav dropdown. Every piece
// belongs to one category (defaulting to 'painting'); 'all' is a virtual view
// that shows everything in featured order.
export const CATEGORIES = [
  { id: 'art', label: 'Art' }, // paintings, digital, pen, pencil — anything on canvas/paper
  { id: 'photography', label: 'Photography' },
  { id: 'zine', label: 'Zines' },
  { id: 'origami', label: 'Origami' },
  { id: 'website', label: 'Websites' },
] as const;

export type Category = (typeof CATEGORIES)[number]['id'];

// Pieces without an explicit `category` fall into 'art'.
export const DEFAULT_CATEGORY: Category = 'art';

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
  /** Filter tags from the TAGS vocabulary (artist + medium). */
  tags?: Tag[];
  /** Which Gallery section/type this belongs to. Defaults to 'painting'. */
  category?: Category;
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

// The ARRAY ORDER below is the "Featured" sort order — grouped by theme.
// `medium`, `date`, and `tags` are intentionally left blank for now — add them per
// piece. Portraits live in /paintings/portraits, landscapes in /paintings/landscapes.
export const paintings: Painting[] = [

  // Featured
  { id: '6', title: 'Sparkles', orientation: 'portrait', medium: "pen", tags:["chaamudi", "pen"], image: '/paintings/portraits/sparkles-1-version-1.png', versions: 4 },

  { id: '29', title: 'Dancer', orientation: 'portrait', medium: "acrylic", tags:["chaamudi", "acrylic"], image: '/paintings/portraits/paint-and-sip-1-version-1.png' },

  { id: '35', title: 'Whimsical Fruits', orientation: 'landscape', medium: "watercolour", tags:["chaamudi", "watercolour"], image: '/paintings/landscapes/whimsicle-fruits-1-version-1.png', versions: 2 },

  { id: '57', title: 'Masquerade Masks', orientation: 'portrait', medium: "acrylic", tags:["milindi", "chaamudi", "acrylic"], image: '/paintings/portraits/masks-1-version-1.png', versions: 9 },

  { id: '12', title: 'Dancing Star', orientation: 'landscape', medium: "watercolour", tags:["chaamudi", "watercolour"], image: '/paintings/landscapes/dancing-star-1-version-1.png' },

  { id: '22', title: 'Queen of the Night', orientation: 'portrait', medium: "chalk", tags:["chaamudi", "chalk"], image: '/paintings/portraits/princess-blue-1-version-1.png' },

  { id: '36', title: 'Imposter', orientation: 'portrait', medium: "watercolour", tags:["milindi", "watercolour"], image: '/paintings/portraits/whimsicle-fruits-2-version-1.png', versions: 2 },

  { id: '55', title: 'Nuwara Eliya', orientation: 'portrait', medium: "photography", category: 'photography', tags:["milindi", "chaamudi", "photography"], image: '/paintings/portraits/nuwara-eliya-1-version-1.png', versions: 2},

  { id: '37', title: 'Burnt Out But Survivin', orientation: 'portrait', medium: "pencil", tags:["chaamudi", "pencil"], image: '/paintings/portraits/grumpy-1-version-1.png' },

  { id: '7', title: 'Sepalika', orientation: 'landscape', medium: "watercolour", tags:["milindi", "watercolour"], image: '/paintings/landscapes/flowers-1-version-1.png', versions: 2 },

  { id: '50', title: 'Black Dog & Black Bird', orientation: 'portrait', medium: "pen", tags:["chaamudi", "pen"], image: '/paintings/portraits/black-dog-black-bird-1-version-1.png'},

  { id: '40', title: 'Natives at Botanic Gardens III', orientation: 'portrait', medium: "watercolour", tags:["milindi", "watercolour"], image: '/paintings/portraits/natives-4-version-1.png'},

  { id: '46', title: 'Koho Koho', orientation: 'landscape', category: 'website', url: 'https://koho-koho.github.io/', tags: ['milindi', 'website'], image: '/paintings/landscapes/koho-koho-1-version-1.png', versions: 2 },

  // Here are the normals
  { id: '1', title: 'Ammi', orientation: 'portrait', medium: "acrylic", tags:["milindi", "acrylic"], image: '/paintings/portraits/background-1-version-1.png' },
  { id: '2', title: 'Radiant Dreamscape', orientation: 'portrait', medium: "acrylic", tags:["chaamudi", "acrylic"], image: '/paintings/portraits/background-2-version-1.png' },

  { id: '3', title: 'Air', orientation: 'portrait', medium: "acrylic", tags:["milindi", "acrylic"], image: '/paintings/portraits/elements-1-version-1.png' },
  { id: '4', title: 'Water', orientation: 'portrait', medium: "acrylic", tags:["chaamudi", "acrylic"], image: '/paintings/portraits/elements-2-version-1.png' },

  { id: '5', title: 'Modern Moonstone', orientation: 'portrait', medium: "acrylic", tags:["milindi", "watercolour"], image: '/paintings/portraits/patterns-1-version-1.png', versions: 2 },

  { id: '8', title: 'Robosia', orientation: 'portrait', medium: "watercolour", tags:["chaamudi", "watercolour"], image: '/paintings/portraits/flowers-2-version-1.png', versions: 3 },

  { id: '9', title: 'Chilli', orientation: 'portrait', medium: "watercolour", tags:["milindi", "watercolour"], image: '/paintings/portraits/trees-1-version-1.png' },
  { id: '10', title: 'Pal path', orientation: 'portrait', medium: "watercolour", tags:["chaamudi", "watercolour"], image: '/paintings/portraits/trees-2-version-1.png' },
  { id: '11', title: 'Jingle frogs', orientation: 'landscape', medium: "felt", tags:["chaamudi", "felt"], image: '/paintings/landscapes/frogs-1-version-1.png' },

  { id: '13', title: 'Galaxy', orientation: 'portrait', medium: "watercolour", tags:["chaamudi", "watercolour"], image: '/paintings/portraits/galaxy-1-version-1.png' },
  { id: '14', title: 'Planet', orientation: 'portrait', medium: "texture", tags:["chaamudi", "texture"], image: '/paintings/portraits/planet-1-version-1.png' },
  { id: '15', title: 'Alien', orientation: 'portrait', medium: "texture", tags:["chaamudi", "texture"], image: '/paintings/portraits/space-alien-1-version-1.png' },

  { id: '16', title: 'Mind Map', orientation: 'landscape', medium: "watercolour", tags:["chaamudi", "watercolour", "pen"], image: '/paintings/landscapes/mind-map-1-version-1.png' },
  { id: '17', title: 'Darkest timeline', orientation: 'portrait', medium: "pencil", tags:["milindi", "pencil"], image: '/paintings/portraits/mind-map-2-version-1.png' },

  { id: '18', title: 'Hearth', orientation: 'portrait', medium: "photography", category: 'photography', tags:["chaamudi", "photography"], image: '/paintings/portraits/natives-1-version-1.png' },
  { id: '19', title: 'Natives at Botanic Gardens I', orientation: 'portrait', medium: "watercolour", tags:["chaamudi", "watercolour"], image: '/paintings/portraits/natives-2-version-1.png' },
  { id: '20', title: 'Natives at Botanic Gardens II', orientation: 'portrait', medium: "watercolour", tags:["chaamudi", "watercolour"], image: '/paintings/portraits/natives-3-version-1.png', versions: 2 },

  { id: '21', title: 'Pearl of the Indian Ocean', orientation: 'portrait', medium: "pen", tags:["chaamudi", "pen"], image: '/paintings/portraits/srilanka-1-version-1.png'},

  { id: '23', title: 'Myosotis : : Silksong OC', orientation: 'portrait', medium: "watercolour", tags:["chaamudi", "watercolour"], image: '/paintings/portraits/silksong-1-version-1.png' },
  { id: '24', title: 'Ayu : : Silksong OC', orientation: 'portrait', medium: "watercolour", tags:["milindi", "watercolour"], image: '/paintings/portraits/silksong-2-version-1.png' },
  { id: '25', title: 'Too Too : : Silksong OC',orientation: 'portrait', medium: "texture", tags:["guest star", "texture"], image: '/paintings/portraits/silksong-3-version-1.png', versions: 2 },
  { id: '26', title: 'Horney-poo shaws!', orientation: 'portrait', medium: "pencil", tags:["milindi", "pencil"], image: '/paintings/portraits/silksong-4-version-1.png', versions: 2 },

  { id: '27', title: 'Slug', orientation: 'portrait', medium: "origami", category: 'origami', tags:["milindi", "origami"], image: '/paintings/portraits/origami-1-version-1.png', versions: 2 },
  { id: '28', title: 'Favourite Things', medium: "watercolour", tags:["milindi", "watercolour"], orientation: 'portrait', image: '/paintings/portraits/doodles-version-1.png', versions: 2 },

  { id: '30', title: 'Tea Spoon', orientation: 'portrait', medium: "wood", tags:["milindi", "wood"], image: '/paintings/portraits/spoon-1-version-1.png' },

  { id: '31', title: 'Tea Cup I', orientation: 'portrait', medium: "watercolour", tags:["chaamudi", "watercolour"], image: '/paintings/portraits/tea-party-1-version-1.png' },
  { id: '32', title: 'Tea Cup II - Factorials', orientation: 'portrait', medium: "watercolour", tags:["guest star", "watercolour"], image: '/paintings/portraits/tea-party-2-version-1.png' },
  { id: '33', title: 'Tea Cup III', orientation: 'portrait', medium: "watercolour", tags:["milindi", "watercolour"], image: '/paintings/portraits/tea-party-3-version-1.png' },
  { id: '34', title: 'Tea Party', orientation: 'portrait', medium: "watercolour", tags:["milindi", "chaamudi", "guest star", "watercolour"], image: '/paintings/portraits/tea-party-4-version-1.png', versions: 2 },

  { id: '38', title: 'Feelings', orientation: 'portrait', medium: "acrylic", tags:["chaamudi", "milindi", "acrylic"], image: '/paintings/portraits/feelings-1-version-1.png', versions: 2},
  { id: '39', title: 'Lights', orientation: 'portrait', medium: "glass paint", tags:["chaamudi", "milindi", "glass paint"], image: '/paintings/portraits/glass-1-version-1.png', versions: 2 },

  { id: '41', title: 'Sinhala Hoodiya (Sinhala Alphabet)', orientation: 'portrait', medium: "pen", tags:["milindi", "pen"], image: '/paintings/portraits/hoodiya-1-version-1.png' },
  { id: '42', title: 'Perpetual third wheel', orientation: 'portrait', medium: "pencil", tags:["milindi", "pencil"], image: '/paintings/portraits/third-wheel-1-version-1.png', versions: 2},

  { id: '43', title: 'Carlton Gardens', orientation: 'portrait', medium: "photography", category: 'photography', tags:["milindi", "photography"], image: '/paintings/portraits/carlton-gardens-1-version-1.png'},
  { id: '44', title: 'Sunrise Through The Years', orientation: 'landscape', medium: "photography", category: 'photography', tags:["milindi", "photography"], image: '/paintings/portraits/morning-1-version-1.png', versions: 4},
  { id: '54', title: 'Autumn', orientation: 'portrait', medium: "photography", category: 'photography', tags:["milindi", "photography"], image: '/paintings/portraits/spider-park-1-version-1.png'},
  { id: '56', title: 'Whisps in the wind', orientation: 'landscape', medium: "photography", category: 'photography', tags:["milindi", "photography"], image: '/paintings/landscapes/cloud-1-version-1.png', versions: 3},
  { id: '58', title: 'Winter', orientation: 'landscape', medium: "photography", category: 'photography', tags:["milindi", "photography"], image: '/paintings/landscapes/winter-1-version-1.png', versions: 2},


  { id: '51', title: 'Shapes I', orientation: 'portrait', medium: "pen", tags:["chaamudi", "pen"], image: '/paintings/portraits/shapes-1-version-1.png'},
  { id: '52', title: 'Shapes II', orientation: 'portrait', medium: "pen", tags:["chaamudi", "pen"], image: '/paintings/portraits/shapes-framed-1-version-1.png'},
  { id: '53', title: 'Bored.', orientation: 'portrait', medium: "digital art", tags:["chaamudi", "digital art"], image: '/paintings/portraits/bored-1-version-1.png'},

  // ---------------------------------------------------------------------------
  // Websites — set `category: 'website'` and `url` to the live site. `image` is a
  // screenshot/thumbnail (drop it in /public/websites/ and reference it here).
  // The detail page embeds the URL in an iframe with an "Open site ↗" fallback.
  { id: '45', title: 'Colourful Language', orientation: 'landscape', category: 'website', url: 'https://colourful-language.github.io/', tags: ['milindi', 'website'], image: '/paintings/landscapes/colourful-lang-1-version-1.png' },
  { id: '47', title: '#MugLife', orientation: 'landscape', category: 'website', url: 'https://muglife.github.io/', tags: ['milindi', 'website'], image: '/paintings/landscapes/mug-life-1-version-1.png' },


  // Zines — set `category: 'zine'`. Use `versions` for multi-page spreads.
  { id: '48', title: '#GuerillaTea', orientation: 'landscape', category: 'zine', tags: ['milindi', 'zine'], image: '/paintings/landscapes/zine-1-version-1.png', versions: 2 },
  { id: '49', title: 'To my special someone . . . .', orientation: 'portrait', category: 'zine', tags: ['chaamudi', 'zine'], image: '/paintings/portraits/zine-2-version-1.png'},

  // Clay — set `category: 'clay'`.
  // { id: '47', title: 'Clay Piece', orientation: 'portrait', category: 'clay', tags: ['milindi', 'clay'], image: '/paintings/portraits/clay-1-version-1.png' },

  // Digital art lives under the 'Art' category (the default) — just tag it 'digital art'.
  // { id: '48', title: 'Digital Piece', orientation: 'portrait', tags: ['chaamudi', 'digital art'], image: '/paintings/portraits/digital-1-version-1.png' },

];
