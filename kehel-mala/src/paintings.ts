export type Orientation = 'landscape' | 'portrait';

export interface Painting {
  id: string;
  title: string;
  /** Who made it — shown as a small muted line above the title (e.g. 'Milindi Kodikara'). */
  artist?: string;
  /** Medium / size / year — shown as a small caption under the title. */
  medium?: string;
  /** 'landscape' (wide) or 'portrait' (tall) — controls the tile shape. */
  orientation: Orientation;
  /** Image path. Drop the file in public/paintings/ and reference it as /paintings/<file>. */
  image: string;
}

// Add a painting by dropping its image file into public/paintings/
// and adding an entry here. Until a matching file exists, a labelled
// placeholder tile is shown automatically.
export const paintings: Painting[] = [
  { id: '1', title: 'Background I', orientation: 'portrait', image: '/paintings/background_1.png' },
  { id: '2', title: 'Background II', orientation: 'portrait', image: '/paintings/background_2.png' },
  { id: '3', title: 'Doodle', orientation: 'portrait', image: '/paintings/doodle.PNG' },
  { id: '4', title: 'Flower I', orientation: 'landscape', image: '/paintings/flower_1.jpg' },
  { id: '5', title: 'Flower II', orientation: 'portrait', image: '/paintings/flower_2.JPG' },
  { id: '6', title: 'Mind Map', orientation: 'landscape', image: '/paintings/mind_map.png' },
  { id: '7', title: 'Native I', orientation: 'portrait', image: '/paintings/native_1.jpg' },
  { id: '8', title: 'Native II', orientation: 'portrait', image: '/paintings/native_2.jpg' },
  { id: '9', title: 'Native III', orientation: 'portrait', image: '/paintings/native_3.jpg' },
  { id: '10', title: 'Pattern I', orientation: 'portrait', image: '/paintings/pattern_1.png' },
  { id: '11', title: 'Space I', orientation: 'portrait', image: '/paintings/space_1.jpg' },
  { id: '12', title: 'Space II', orientation: 'landscape', image: '/paintings/space_2.jpg' },
  { id: '13', title: 'Tea Party', orientation: 'portrait', image: '/paintings/tea_party.png' },
  { id: '14', title: 'Whimsical Fruits', orientation: 'landscape', image: '/paintings/whimsicle_fruits_1.png' },
];
