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
] as const;

export type Tag = (typeof TAGS)[number];

export interface Painting {
  id: string;
  title: string;
  /** Who made it — shown as a small muted line above the title (e.g. 'Milindi'). */
  artist?: string;
  /** Medium — shown as a small caption under the title (e.g. 'Oil on canvas'). */
  medium?: string;
  /** Creation date as 'YYYY-MM' (month + year). Drives the Newest/Oldest sort. */
  date?: string;
  /** Filter tags from the TAGS vocabulary (artist + medium). */
  tags?: Tag[];
  /** 'landscape' (wide) or 'portrait' (tall) — controls the tile shape. */
  orientation: Orientation;
  /** Primary image path (the `-version-1` file). */
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
  // Backgrounds
  { id: '1', title: 'My mother', orientation: 'portrait', medium: "acrylic", date:"2025-12", tags:["milindi", "acrylic"], image: '/paintings/portraits/background-1-version-1.png' },
  { id: '2', title: 'Dreamscape', orientation: 'portrait', medium: "acrylic", date:"2025-12", tags:["chaamudi", "acrylic"], image: '/paintings/portraits/background-2-version-1.png' },

  // Elements
  { id: '3', title: 'Air', orientation: 'portrait', medium: "acrylic", date:"2025-10", tags:["milindi", "acrylic"], image: '/paintings/portraits/elements-1-version-1.png' },
  { id: '4', title: 'Water', orientation: 'portrait', medium: "acrylic", date:"2025-10", tags:["chaamudi", "acrylic"], image: '/paintings/portraits/elements-2-version-1.png' },

  // Patterns & Sparkles
  { id: '5', title: 'Modern Moonstone', orientation: 'portrait', medium: "acrylic", date:"2025-11", tags:["milindi", "watercolour"], image: '/paintings/portraits/patterns-1-version-1.png' },
  { id: '6', title: 'Sparkles', orientation: 'portrait', medium: "pen", date:"2025-12", tags:["chaamudi", "pen"], image: '/paintings/portraits/sparkles-1-version-1.png', versions: 3 },

  // Flowers (theme spans both folders)
  { id: '7', title: 'Sepalika', orientation: 'landscape', medium: "watercolour", date:"2026-04", tags:["milindi", "watercolour"], image: '/paintings/landscapes/flowers-1-version-1.png' },
  { id: '8', title: 'Robosia', orientation: 'portrait', medium: "watercolour", date:"2026-04", tags:["chaamudi", "watercolour"], image: '/paintings/portraits/flowers-2-version-1.png', versions: 2 },

  // Trees & Frogs
  { id: '9', title: 'Chilli', orientation: 'portrait', medium: "watercolour", date:"2025-10", tags:["milindi", "watercolour"], image: '/paintings/portraits/trees-1-version-1.png' },
  { id: '10', title: 'Gedara', orientation: 'portrait', medium: "watercolour", date:"2025-10", tags:["chaamudi", "watercolour"], image: '/paintings/portraits/trees-2-version-1.png' },
  { id: '11', title: 'Jingle frogs', orientation: 'landscape', medium: "felt", date:"2025-12", tags:["chaamudi", "felt"], image: '/paintings/landscapes/frogs-1-version-1.png' },

  // Space
  { id: '12', title: 'Dancing with the Stars', orientation: 'landscape', medium: "watercolour", date:"2026-1", tags:["chaamudi", "watercolour"], image: '/paintings/landscapes/dancing-star-1-version-1.png' },
  { id: '13', title: 'Galaxy', orientation: 'portrait', medium: "watercolour", date:"2021", tags:["chaamudi", "watercolour"], image: '/paintings/portraits/galaxy-1-version-1.png' },
  { id: '14', title: 'Planet', orientation: 'portrait', medium: "texture", date:"2026-1", tags:["chaamudi", "texture"], image: '/paintings/portraits/planet-1-version-1.png' },
  { id: '15', title: 'Alien', orientation: 'portrait', medium: "texture", date:"2026-1", tags:["chaamudi", "texture"], image: '/paintings/portraits/space-alien-1-version-1.png' },

  // Mind Map (theme spans both folders)
  { id: '16', title: 'Mind Map', orientation: 'landscape', medium: "watercolour", date:"2026-2", tags:["chaamudi", "watercolour", "pen"], image: '/paintings/landscapes/mind-map-1-version-1.png' },
  { id: '17', title: 'Darkest timeline', orientation: 'portrait', medium: "pencil", date:"2025-12", tags:["milindi", "pencil"], image: '/paintings/portraits/mind-map-2-version-1.png' },

  // Natives
  { id: '18', title: 'Hearth', orientation: 'portrait', medium: "photography", date:"2025-11", tags:["chaamudi", "photography"], image: '/paintings/portraits/natives-1-version-1.png' },
  { id: '19', title: 'Natives at Botanic Gardens I', orientation: 'portrait', medium: "watercolour", date:"2025-11", tags:["chaamudi", "watercolour"], image: '/paintings/portraits/natives-2-version-1.png' },
  { id: '20', title: 'Natives at Botanic Gardens II', orientation: 'portrait', medium: "watercolour", date:"2025-11", tags:["chaamudi", "watercolour"], image: '/paintings/portraits/natives-3-version-1.png', versions: 2 },
  { id: '40', title: 'Natives at Botanic Gardens III', orientation: 'portrait', medium: "watercolour", date:"2025-11", tags:["milindi", "watercolour"], image: '/paintings/portraits/natives-4-version-1.png' },

  // Sri Lanka & Princess Blue
  { id: '21', title: 'Sri Lanka', orientation: 'portrait', medium: "pen", date:"2024-12", tags:["chaamudi", "pen"], image: '/paintings/portraits/srilanka-1-version-1.png' },
  { id: '22', title: 'Blue', orientation: 'portrait', medium: "pen", date:"2020-08", tags:["chaamudi", "pen"], image: '/paintings/portraits/princess-blue-1-version-1.png' },

  // Silksong
  { id: '23', title: 'Brave Silksong OC', orientation: 'portrait', medium: "watercolour", date:"2026-2", tags:["chaamudi", "watercolour"], image: '/paintings/portraits/silksong-1-version-1.png' },
  { id: '24', title: 'Tragic Silksong OC', orientation: 'portrait', medium: "watercolour", date:"2026-2", tags:["milindi", "watercolour"], image: '/paintings/portraits/silksong-2-version-1.png' },
  { id: '25', title: 'Menace of a Silksong OC',orientation: 'portrait', medium: "watercolour", date:"2026-2", tags:["guest star", "texture"], image: '/paintings/portraits/silksong-3-version-1.png', versions: 2 },
  { id: '26', title: 'Best day i.e the three months where we played games nonstop', orientation: 'portrait', medium: "pencil", date:"2026-2", tags:["milindi", "pencil"], image: '/paintings/portraits/silksong-4-version-1.png' },

  // Origami & Doodles
  { id: '27', title: 'Slug', orientation: 'portrait', medium: "origami", date:"2026-3", tags:["milindi", "origami"], image: '/paintings/portraits/origami-1-version-1.png', versions: 2 },
  { id: '28', title: 'Doodles', medium: "watercolour", date:"2025-11", tags:["milindi", "watercolour"], orientation: 'portrait', image: '/paintings/portraits/doodles-version-1.png' },

  // Paint and Sip & Spoon
  { id: '29', title: 'Dancer', orientation: 'portrait', medium: "acrylic", date:"2026-4", tags:["chaamudi", "acrylic"], image: '/paintings/portraits/paint-and-sip-1-version-1.png' },
  { id: '30', title: 'Tea spoon', orientation: 'portrait', medium: "wood", date:"2026-1", tags:["milindi", "wood"], image: '/paintings/portraits/spoon-1-version-1.png' },

  // Tea Party
  { id: '31', title: 'Tea cup I', orientation: 'portrait', medium: "watercolour", date:"2026-6", tags:["chaamudi", "watercolour"], image: '/paintings/portraits/tea-party-1-version-1.png' },
  { id: '32', title: 'Tea cup II - Factorials', orientation: 'portrait', medium: "watercolour", date:"2026-6", tags:["guest star", "watercolour"], image: '/paintings/portraits/tea-party-2-version-1.png' },
  { id: '33', title: 'Tea cup III', orientation: 'portrait', medium: "watercolour", date:"2026-6", tags:["milindi", "watercolour"], image: '/paintings/portraits/tea-party-3-version-1.png' },
  { id: '34', title: 'Tea Party', orientation: 'portrait', medium: "watercolour", date:"2026-6", tags:["milindi", "chaamudi", "guest star", "watercolour"], image: '/paintings/portraits/tea-party-4-version-1.png' },

  // Whimsical Fruits (theme spans both folders)
  { id: '35', title: 'Whimsical Fruits', orientation: 'landscape', medium: "watercolour", date:"2025-10", tags:["chaamudi", "watercolour"], image: '/paintings/landscapes/whimsicle-fruits-1-version-1.png' },
  { id: '36', title: 'Imposter', orientation: 'portrait', medium: "watercolour", date:"2025-10", tags:["milindi", "watercolour"], image: '/paintings/portraits/whimsicle-fruits-2-version-1.png' },

  // Random
  { id: '37', title: 'Burnt out but survivin', orientation: 'portrait', medium: "pencil", date:"2026-2", tags:["chaamudi", "pencil"], image: '/paintings/portraits/grumpy-1-version-1.png' },

  { id: '38', title: 'Feelings', orientation: 'portrait', medium: "acrylic", date:"2025-11", tags:["chaamudi", "milindi", "acrylic"], image: '/paintings/portraits/feelings-1-version-1.png', versions: 2},
  { id: '39', title: 'Lights', orientation: 'portrait', medium: "glass paint", date:"2025-11", tags:["chaamudi", "milindi", "glass paint"], image: '/paintings/portraits/glass-1-version-1.png', versions: 2 },

  { id: '41', title: 'Sinhala Hoodiya (Sinhala Alphabet)', orientation: 'portrait', medium: "pen", date:"2026-02", tags:["milindi", "pen"], image: '/paintings/portraits/hoodiya-1-version-1.png' },
  { id: '42', title: 'Perpetual third wheel', orientation: 'portrait', medium: "pencil", date:"2026-02", tags:["milindi", "pencil"], image: '/paintings/portraits/third-wheel-1-version-1.png'},

  { id: '43', title: 'Carlton Gardens', orientation: 'portrait', medium: "photography", date:"2025-11", tags:["milindi", "photography"], image: '/paintings/portraits/carlton-gardens-1-version-1.png'},
  { id: '44', title: 'Sunrise through the years', orientation: 'landscape', medium: "photography", tags:["milindi", "photography"], image: '/paintings/portraits/morning-1-version-1.png', versions: 5},

];
