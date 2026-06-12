import React, { useEffect, useLayoutEffect, useRef, useState } from 'react';
import './App.css';
import logo from './logo.svg';
import {
  paintings,
  Painting,
  Orientation,
  TAGS,
  Tag,
  CATEGORIES,
  Category,
  DEFAULT_CATEGORY,
} from './paintings';

// Top-level nav targets used to highlight the active menu item.
type Page = 'about' | 'gallery' | 'contact';

// A route is a top-level page, the gallery (optionally filtered to one category,
// or 'all'), or a single artwork detail view.
type Route =
  | { kind: 'page'; page: 'about' | 'contact' }
  | { kind: 'gallery'; category: Category | 'all' }
  | { kind: 'work'; id: string };

const CONTACT_EMAIL = 'milindi.beeloud@gmail.com';

const MONTHS = [
  'January', 'February', 'March', 'April', 'May', 'June',
  'July', 'August', 'September', 'October', 'November', 'December',
];

// 'YYYY-MM' -> 'Month YYYY'
function formatDate(date?: string): string {
  if (!date) return '';
  const [y, m] = date.split('-').map(Number);
  return MONTHS[m - 1] ? `${MONTHS[m - 1]} ${y}` : '';
}

// Soft placeholder shown until a real image file exists at the given path.
function placeholder(title: string, orientation: Orientation): string {
  const [w, h] = orientation === 'landscape' ? [842, 595] : [595, 842];
  const svg = `<svg xmlns='http://www.w3.org/2000/svg' width='${w}' height='${h}'>
    <rect width='100%' height='100%' fill='#ffffff'/>
    <text x='50%' y='50%' fill='#b3a89a' font-family='Georgia, serif'
      font-size='28' text-anchor='middle' dominant-baseline='middle'>${title}</text>
  </svg>`;
  return `data:image/svg+xml;utf8,${encodeURIComponent(svg)}`;
}

// Build the extra version paths from a primary image named `...-version-1.<ext>`,
// given the TOTAL number of versions. e.g. ('.../sparkles-1-version-1.png', 3) ->
// ['.../sparkles-1-version-2.png', '.../sparkles-1-version-3.png'].
function versionPaths(image: string, total: number): string[] {
  const m = image.match(/^(.*-version-)\d+(\.[^.]+)$/);
  if (!m) return [];
  const [, prefix, ext] = m;
  const paths: string[] = [];
  for (let n = 2; n <= total; n++) paths.push(`${prefix}${n}${ext}`);
  return paths;
}

// All image paths for a piece: the primary image plus any explicit variants or
// numbered `-version-N` files.
function imagesFor(painting: Painting): string[] {
  const extra =
    painting.variants ?? (painting.versions ? versionPaths(painting.image, painting.versions) : []);
  return [painting.image, ...extra];
}

function GalleryImage({ painting }: { painting: Painting }) {
  const images = imagesFor(painting);
  const [index, setIndex] = useState(0);
  const multiple = images.length > 1;
  const touchStartX = useRef<number | null>(null);
  const href = `#/work/${painting.id}`;

  const go = (delta: number) =>
    setIndex((i) => (i + delta + images.length) % images.length);

  const onTouchStart = (e: React.TouchEvent) => {
    touchStartX.current = e.touches[0].clientX;
  };
  const onTouchEnd = (e: React.TouchEvent) => {
    if (touchStartX.current === null) return;
    const dx = e.changedTouches[0].clientX - touchStartX.current;
    if (Math.abs(dx) > 40) go(dx < 0 ? 1 : -1); // swipe left → next
    touchStartX.current = null;
  };

  const onError = (e: React.SyntheticEvent<HTMLImageElement>) => {
    e.currentTarget.src = placeholder(painting.title, painting.orientation);
  };

  return (
    <figure className={`piece ${painting.orientation}`}>
      <div className="piece-frame">
        <div className="piece-stack" onTouchStart={onTouchStart} onTouchEnd={onTouchEnd}>
          {/* The image links through to the artwork's detail page. */}
          <a className="piece-link" href={href} aria-label={`View ${painting.title}`}>
            <img
              src={images[index]}
              alt={`${painting.title}${multiple ? ` (${index + 1} of ${images.length})` : ''}`}
              loading="lazy"
              onError={onError}
            />
          </a>

          {/* Version controls overlay the image (siblings of the link, not nested). */}
          {multiple && (
            <>
              <button
                type="button"
                className="piece-nav prev"
                aria-label="Previous version"
                onClick={() => go(-1)}
              />
              <button
                type="button"
                className="piece-nav next"
                aria-label="Next version"
                onClick={() => go(1)}
              />
              <div className="piece-dots">
                {images.map((src, i) => (
                  <button
                    key={src}
                    type="button"
                    className={i === index ? 'dot active' : 'dot'}
                    aria-label={`View version ${i + 1}`}
                    onClick={() => setIndex(i)}
                  />
                ))}
              </div>
            </>
          )}
        </div>
      </div>
      <a className="piece-caption-link" href={href}>
        <figcaption className="piece-caption">
          {painting.artist && <span className="piece-artist">{painting.artist}</span>}
          <span className="piece-title">{painting.title}</span>
          {(painting.medium || painting.date) && (
            <span className="piece-meta">
              {[painting.medium, formatDate(painting.date)].filter(Boolean).join(' · ')}
            </span>
          )}
        </figcaption>
      </a>
    </figure>
  );
}

// Fullscreen image gallery: horizontal arrows (or ← → keys) switch between the
// versions, and moving the cursor over the image zooms into that spot.
function Lightbox({
  images,
  title,
  startIndex,
  onClose,
}: {
  images: string[];
  title: string;
  startIndex: number;
  onClose: (index: number) => void;
}) {
  const [index, setIndex] = useState(startIndex);
  const [zoomed, setZoomed] = useState(false);
  const [origin, setOrigin] = useState('50% 50%'); // zoom focal point, kept across fade-out
  const multiple = images.length > 1;

  const go = (delta: number) => {
    setZoomed(false);
    setIndex((i) => (i + delta + images.length) % images.length);
  };

  // Esc closes; arrow keys navigate. Also lock background scroll while open.
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose(index);
      else if (e.key === 'ArrowLeft') go(-1);
      else if (e.key === 'ArrowRight') go(1);
    };
    window.addEventListener('keydown', onKey);
    const prevOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    return () => {
      window.removeEventListener('keydown', onKey);
      document.body.style.overflow = prevOverflow;
    };
  }, [index]); // eslint-disable-line react-hooks/exhaustive-deps

  const onMove = (e: React.MouseEvent<HTMLImageElement>) => {
    const r = e.currentTarget.getBoundingClientRect();
    const x = ((e.clientX - r.left) / r.width) * 100;
    const y = ((e.clientY - r.top) / r.height) * 100;
    setOrigin(`${x}% ${y}%`);
    if (!zoomed) setZoomed(true);
  };

  return (
    <div className="lightbox" role="dialog" aria-modal="true" aria-label={title}>
      <button className="lightbox-backdrop" aria-label="Close gallery" onClick={() => onClose(index)} />

      <button type="button" className="lightbox-close" aria-label="Close" onClick={() => onClose(index)}>
        ✕
      </button>

      {multiple && (
        <button type="button" className="lightbox-nav prev" aria-label="Previous version" onClick={() => go(-1)} />
      )}

      <figure className="lightbox-stage">
        <img
          className={zoomed ? 'lightbox-img zoomed' : 'lightbox-img'}
          src={images[index]}
          alt={`${title}${multiple ? ` — version ${index + 1} of ${images.length}` : ''}`}
          style={{ transformOrigin: origin }}
          onMouseMove={onMove}
          onMouseLeave={() => setZoomed(false)}
          draggable={false}
        />
      </figure>

      {multiple && (
        <button type="button" className="lightbox-nav next" aria-label="Next version" onClick={() => go(1)} />
      )}

      {multiple && (
        <div className="lightbox-counter">
          {index + 1} / {images.length}
        </div>
      )}
    </div>
  );
}

// The detail page for a single artwork: a large image with a version switcher and
// the full set of details (medium, date, dimensions, tags, description).
function WorkPage({ id, backHref, backLabel }: { id: string; backHref: string; backLabel: string }) {
  const painting = paintings.find((p) => p.id === id);
  const [index, setIndex] = useState(0);
  const [lightbox, setLightbox] = useState(false);
  const [embedFailed, setEmbedFailed] = useState(false);

  if (!painting) {
    return (
      <section className="page work-missing">
        <h2 className="page-title">Work not found</h2>
        <p className="site-desc">
          We couldn't find that piece. <a href={backHref}>Back to {backLabel} →</a>
        </p>
      </section>
    );
  }

  const images = imagesFor(painting);
  const multiple = images.length > 1;
  const subject = encodeURIComponent(`Enquiry about "${painting.title}"`);
  const isWebsite = painting.category === 'website' && !!painting.url;

  const onError = (e: React.SyntheticEvent<HTMLImageElement>) => {
    e.currentTarget.src = placeholder(painting.title, painting.orientation);
  };

  return (
    <article className="work-page">
      <a className="work-back" href={backHref}>
        ‹ Back to {backLabel}
      </a>

      <div className={`work-layout ${painting.orientation}`}>
        <div className="work-media">
          {isWebsite ? (
            <div className="work-website">
              {embedFailed ? (
                <a
                  className="work-embed-fallback"
                  href={painting.url}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  <img src={images[0]} alt={painting.title} onError={onError} />
                  <span className="work-embed-note">
                    This site can't be embedded — open it in a new tab ↗
                  </span>
                </a>
              ) : (
                <iframe
                  className={`work-iframe ${painting.orientation}`}
                  src={painting.url}
                  title={painting.title}
                  loading="lazy"
                  onError={() => setEmbedFailed(true)}
                />
              )}
              <a
                className="work-visit"
                href={painting.url}
                target="_blank"
                rel="noopener noreferrer"
              >
                Open site ↗
              </a>
            </div>
          ) : (
            <>
              <button
                type="button"
                className={`work-frame ${painting.orientation}`}
                onClick={() => setLightbox(true)}
                aria-label="Open full-size gallery"
              >
                <img
                  src={images[index]}
                  alt={`${painting.title}${multiple ? ` — version ${index + 1} of ${images.length}` : ''}`}
                  onError={onError}
                />
                <span className="work-zoom-hint" aria-hidden="true">⤢</span>
              </button>

              {multiple && (
            <div className="work-thumbs" role="tablist" aria-label="Versions">
              {images.map((src, i) => (
                <button
                  key={src}
                  type="button"
                  role="tab"
                  aria-selected={i === index}
                  aria-label={`Version ${i + 1}`}
                  className={i === index ? 'work-thumb active' : 'work-thumb'}
                  onClick={() => setIndex(i)}
                >
                  <img src={src} alt="" loading="lazy" onError={onError} />
                </button>
              ))}
            </div>
              )}
            </>
          )}
        </div>

        <div className="work-info">
          {painting.artist && <span className="work-artist">{painting.artist}</span>}
          <h2 className="work-title">{painting.title}</h2>

          <dl className="work-specs">
            {painting.medium && (
              <div className="work-spec">
                <dt>Medium</dt>
                <dd>{painting.medium}</dd>
              </div>
            )}
            {painting.date && (
              <div className="work-spec">
                <dt>Created</dt>
                <dd>{formatDate(painting.date)}</dd>
              </div>
            )}
            {painting.dimensions && (
              <div className="work-spec">
                <dt>Dimensions</dt>
                <dd>{painting.dimensions}</dd>
              </div>
            )}
            {multiple && (
              <div className="work-spec">
                <dt>Versions</dt>
                <dd>{images.length}</dd>
              </div>
            )}
          </dl>

          {painting.description && <p className="work-desc">{painting.description}</p>}

          {painting.tags && painting.tags.length > 0 && (
            <div className="work-tags">
              {painting.tags.map((t) => (
                <a key={t} className="work-tag" href="#/gallery">
                  {t}
                </a>
              ))}
            </div>
          )}

          <a className="work-enquire" href={`mailto:${CONTACT_EMAIL}?subject=${subject}`}>
            Enquire about this piece
          </a>
        </div>
      </div>

      {lightbox && (
        <Lightbox
          images={images}
          title={painting.title}
          startIndex={index}
          onClose={(i) => {
            setIndex(i);
            setLightbox(false);
          }}
        />
      )}
    </article>
  );
}

function NavBar({ page }: { page: Page }) {
  const [open, setOpen] = useState(false);
  const dropRef = useRef<HTMLDivElement>(null);

  // Close the Gallery dropdown on outside click or Escape.
  useEffect(() => {
    if (!open) return;
    const onDown = (e: MouseEvent) => {
      if (dropRef.current && !dropRef.current.contains(e.target as Node)) setOpen(false);
    };
    const onKey = (e: KeyboardEvent) => e.key === 'Escape' && setOpen(false);
    document.addEventListener('mousedown', onDown);
    document.addEventListener('keydown', onKey);
    return () => {
      document.removeEventListener('mousedown', onDown);
      document.removeEventListener('keydown', onKey);
    };
  }, [open]);

  return (
    <header className="navbar">
      <a className="brand" href="#/gallery">
        <span className="brand-text">කෙහෙල් මල</span>
        <img src={logo} alt="kehel mala" />
        <span className="brand-text">kehel mala</span>
        <h1 className="visually-hidden">🍌 කෙහෙල් මල 🍌 kehel mala 🍌 banana flower 🍌</h1>
      </a>
      <nav className="nav-links">
        <a href="#/about" className={page === 'about' ? 'active' : ''}>
          About Us
        </a>

        <div className="nav-dropdown" ref={dropRef}>
          {/* The label navigates to "All"; the caret opens the type menu. */}
          <a
            href="#/gallery"
            className={`nav-trigger-link ${page === 'gallery' ? 'active' : ''}`}
            onClick={() => setOpen(false)}
          >
            Gallery
          </a>
          <button
            type="button"
            className="nav-caret"
            aria-label="Browse gallery types"
            aria-haspopup="true"
            aria-expanded={open}
            onClick={() => setOpen((o) => !o)}
          >
            <span className={open ? 'caret up' : 'caret'} aria-hidden="true" />
          </button>
          {open && (
            <div className="nav-menu" role="menu">
              <a role="menuitem" href="#/gallery" onClick={() => setOpen(false)}>
                All
              </a>
              {CATEGORIES.map((c) => (
                <a
                  key={c.id}
                  role="menuitem"
                  href={`#/gallery/${c.id}`}
                  onClick={() => setOpen(false)}
                >
                  {c.label}
                </a>
              ))}
            </div>
          )}
        </div>

        <a href="#/contact" className={page === 'contact' ? 'active' : ''}>
          Contact Us
        </a>
      </nav>
    </header>
  );
}

function AboutPage() {
  return (
    <section className="page about-page">
      <h2 className="page-title">About Us</h2>
      <p className="site-desc">
        Ayubowan, friends! This website showcases the various creative pursuits of the Sri Lankan sibling duo Milindi and Chaamudi,
        living in Melbourne trying to do
        anything but the shit they are supposed to do 💅🏾
     </p>


     <p className="site-desc">
        Hope you have a fun scroll through our creations from our Friday <span className="accent">akki</span> and <span className="accent">nangi</span>  (big sister and little sister) times 🍌
      </p>

      <section className="dictionary">
        <h3 className="dict-title">kehel mala</h3>
        <p className="dict-etymology">
          <em>Sri Lankan slang, from <span className="accent">kehel</span> banana
          + <span className="accent">mala</span> flower</em>
        </p>
        <p className="dict-def">
            Colloquially used to mean something along the lines of "Ah shit!", "Da hell!" or to
            express strong contradiction, similar to saying "Yeah, right!" or "Mhmm" (with attitude).
        </p>
        <p className="dict-usage">
          <span className="accent">Usage:</span> When your sister does some dumb shit, you say,{' '}
          "<em>Mona kehel malakda?!</em>" to convey your displeasure at them.
        </p>
      </section>
    </section>
  );
}

const ARTIST_TAGS: Tag[] = ['milindi', 'chaamudi', 'guest star'];
const MEDIUM_TAGS: Tag[] = TAGS.filter((t) => !ARTIST_TAGS.includes(t));

type Sort = 'featured' | 'newest' | 'oldest';

function GalleryPage({ category }: { category: Category | 'all' }) {
  const [open, setOpen] = useState(false);
  const [selected, setSelected] = useState<Tag[]>([]);
  const [sort, setSort] = useState<Sort>('featured');

  const toggle = (t: Tag) =>
    setSelected((s) => (s.includes(t) ? s.filter((x) => x !== t) : [...s, t]));

  const selArtists = selected.filter((t) => ARTIST_TAGS.includes(t));
  const selMediums = selected.filter((t) => MEDIUM_TAGS.includes(t));

  const heading =
    category === 'all' ? 'Gallery' : CATEGORIES.find((c) => c.id === category)?.label ?? 'Gallery';

  // First narrow to the selected type, then apply the tag filters.
  // Within a group, match ANY selected tag; across groups, match ALL groups (Outré-style).
  const filtered = paintings.filter((p) => {
    if (category !== 'all' && (p.category ?? DEFAULT_CATEGORY) !== category) return false;
    const tags = p.tags ?? [];
    const artistOk = selArtists.length === 0 || selArtists.some((t) => tags.includes(t));
    const mediumOk = selMediums.length === 0 || selMediums.some((t) => tags.includes(t));
    return artistOk && mediumOk;
  });

  // 'featured' keeps the paintings.ts array order; otherwise sort by date.
  const visible =
    sort === 'featured'
      ? filtered
      : [...filtered].sort((a, b) => {
          const cmp = (a.date ?? '').localeCompare(b.date ?? '');
          return sort === 'newest' ? -cmp : cmp;
        });

  const renderChips = (group: Tag[]) =>
    group.map((t) => (
      <button
        key={t}
        type="button"
        className={selected.includes(t) ? 'filter-chip active' : 'filter-chip'}
        aria-pressed={selected.includes(t)}
        onClick={() => toggle(t)}
      >
        {t}
      </button>
    ));

  return (
    <main className="gallery-page">
      <h2 className="page-title gallery-title">{heading}</h2>
      <div className="gallery-controls">
        <div className="filter-bar">
          <button
            type="button"
            className="filter-toggle"
            aria-expanded={open}
            onClick={() => setOpen((o) => !o)}
          >
            Filter{selected.length ? ` (${selected.length})` : ''}
            <span className={open ? 'caret up' : 'caret'} aria-hidden="true" />
          </button>
          <div className="bar-right">
            <span className="result-count">
              {visible.length} {visible.length === 1 ? 'work' : 'works'}
            </span>
            <label className="sort-wrap">
              <span className="sort-label">Sort by</span>
              <select
                className="sort-select"
                value={sort}
                onChange={(e) => setSort(e.target.value as Sort)}
              >
                <option value="featured">Featured</option>
                <option value="newest">Newest</option>
                <option value="oldest">Oldest</option>
              </select>
            </label>
          </div>
        </div>

        {open && (
          <div className="filter-panel">
            <div className="filter-group">
              <h3 className="filter-heading">Artist</h3>
              <div className="filter-chips">{renderChips(ARTIST_TAGS)}</div>
            </div>
            <div className="filter-group">
              <h3 className="filter-heading">Medium</h3>
              <div className="filter-chips">{renderChips(MEDIUM_TAGS)}</div>
            </div>
          </div>
        )}

        {selected.length > 0 && (
          <div className="applied-filters">
            <span className="applied-label">Applied:</span>
            {selected.map((t) => (
              <button key={t} type="button" className="applied-pill" onClick={() => toggle(t)}>
                {t} <span aria-hidden="true">✕</span>
              </button>
            ))}
            <button type="button" className="clear-all" onClick={() => setSelected([])}>
              Clear all
            </button>
          </div>
        )}
      </div>

      {visible.length === 0 ? (
        <p className="no-results">
          {selected.length === 0 && category !== 'all'
            ? 'Nothing here yet — check back soon.'
            : 'No works match these filters.'}
        </p>
      ) : (
        <div className="gallery">
          {visible.map((p) => (
            <GalleryImage key={p.id} painting={p} />
          ))}
        </div>
      )}
    </main>
  );
}

function ContactPage() {
  return (
    <section className="page contact-page">
      <h2 className="page-title">Contact Us</h2>
      <p className="contact-intro">
        For commissions, prints, tea towels, collaborations or to simply say hi you can email us at{' '}
        <a href={`mailto:${CONTACT_EMAIL}`}>{CONTACT_EMAIL}</a> or give us a call on{' '}
        <a href="tel:+61452503667">(04) 5 250 3667</a>.
      </p>
    </section>
  );
}

// Read the current route from the URL hash. '#/work/<id>' opens an artwork detail
// page; anything else is a top-level page, defaulting to the gallery.
function routeFromHash(): Route {
  const raw = window.location.hash.replace(/^#\/?/, '');
  const work = raw.match(/^work\/(.+)$/);
  if (work) return { kind: 'work', id: decodeURIComponent(work[1]) };
  if (raw === 'about') return { kind: 'page', page: 'about' };
  if (raw === 'contact') return { kind: 'page', page: 'contact' };
  // '#/gallery' (all) or '#/gallery/<category>' (one type).
  const gal = raw.match(/^gallery(?:\/([\w-]+))?$/);
  const cat = gal?.[1];
  const valid = CATEGORIES.some((c) => c.id === cat);
  return { kind: 'gallery', category: valid ? (cat as Category) : 'all' };
}

// The gallery URL and human label for a category (used by the detail page's
// "Back to …" link so it returns to the section the visitor came from).
function galleryHref(category: Category | 'all'): string {
  return category === 'all' ? '#/gallery' : `#/gallery/${category}`;
}
function galleryLabel(category: Category | 'all'): string {
  if (category === 'all') return 'gallery';
  return CATEGORIES.find((c) => c.id === category)?.label ?? 'gallery';
}

function App() {
  const [route, setRoute] = useState<Route>(routeFromHash());
  // Remember each route's scroll position so returning from a detail page lands
  // back where you left off, while brand-new routes still start at the top.
  const scrollPositions = useRef<Record<string, number>>({});
  const currentHash = useRef<string>(window.location.hash);
  // The last gallery category the visitor browsed, so a work's "Back" link returns
  // to that section (e.g. Photography) rather than always to "All".
  const lastGalleryCat = useRef<Category | 'all'>(
    route.kind === 'gallery' ? route.category : 'all',
  );

  useEffect(() => {
    const onHashChange = () => {
      // Stash the scroll position of the page we're leaving before switching.
      scrollPositions.current[currentHash.current] = window.scrollY;
      currentHash.current = window.location.hash;
      setRoute(routeFromHash());
    };
    window.addEventListener('hashchange', onHashChange);
    return () => window.removeEventListener('hashchange', onHashChange);
  }, []);

  // After the new route renders, restore its saved scroll position (0 if unseen).
  useLayoutEffect(() => {
    const saved = scrollPositions.current[currentHash.current] ?? 0;
    window.scrollTo(0, saved);
    const raf = requestAnimationFrame(() => window.scrollTo(0, saved));
    return () => cancelAnimationFrame(raf);
  }, [route]);

  // Track the section the visitor is browsing while they're on a gallery view.
  if (route.kind === 'gallery') lastGalleryCat.current = route.category;

  // The gallery and any artwork detail page keep the Gallery nav item active.
  const navPage: Page = route.kind === 'page' ? route.page : 'gallery';

  return (
    <div className="App">
      <NavBar page={navPage} />

      <div className="content">
        {route.kind === 'work' && (
          <WorkPage
            key={route.id}
            id={route.id}
            backHref={galleryHref(lastGalleryCat.current)}
            backLabel={galleryLabel(lastGalleryCat.current)}
          />
        )}
        {route.kind === 'gallery' && <GalleryPage category={route.category} />}
        {route.kind === 'page' && route.page === 'about' && <AboutPage />}
        {route.kind === 'page' && route.page === 'contact' && <ContactPage />}
      </div>

      <footer className="site-footer">
        <div className="footer-cols">
          <nav className="footer-col" aria-label="Site map">
            <h3 className="footer-heading">Quick Links</h3>
            <a href="#/about">About Us</a>
            <a href="#/gallery">Gallery</a>
            <a href="#/contact">Contact Us</a>
          </nav>
          <div className="footer-col">
            <h3 className="footer-heading">Get in Touch</h3>
            <a href={`mailto:${CONTACT_EMAIL}`}>{CONTACT_EMAIL}</a>
            <a href="tel:+61452503667">(04) 5 250 3667</a>
          </div>
        </div>
        <p className="copyright">
          2026 kehel mala™.
        </p>
      </footer>
    </div>
  );
}

export default App;
