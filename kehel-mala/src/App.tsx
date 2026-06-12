import React, { useEffect, useState } from 'react';
import './App.css';
import logo from './logo.svg';
import { paintings, Painting, Orientation, TAGS, Tag } from './paintings';

type Page = 'about' | 'gallery' | 'contact';
const PAGES: Page[] = ['about', 'gallery', 'contact'];

// A route is either one of the top-level pages or a single artwork detail view.
type Route = { kind: 'page'; page: Page } | { kind: 'work'; id: string };

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
    <rect width='100%' height='100%' fill='#ece9e4'/>
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
  const count = imagesFor(painting).length;

  const onError = (e: React.SyntheticEvent<HTMLImageElement>) => {
    e.currentTarget.src = placeholder(painting.title, painting.orientation);
  };

  return (
    <figure className={`piece ${painting.orientation}`}>
      {/* The whole tile is a link to the artwork's detail page (Outré style). */}
      <a className="piece-link" href={`#/work/${painting.id}`} aria-label={`View ${painting.title}`}>
        <div className="piece-frame">
          <div className="piece-stack">
            <img src={painting.image} alt={painting.title} loading="lazy" onError={onError} />
            {count > 1 && (
              <span className="piece-badge">{count} versions</span>
            )}
          </div>
        </div>
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

// The detail page for a single artwork: a large image with a version switcher and
// the full set of details (medium, date, dimensions, tags, description).
function WorkPage({ id }: { id: string }) {
  const painting = paintings.find((p) => p.id === id);
  const [index, setIndex] = useState(0);

  if (!painting) {
    return (
      <section className="page work-missing">
        <h2 className="page-title">Work not found</h2>
        <p className="site-desc">
          We couldn't find that piece. <a href="#/gallery">Back to the gallery →</a>
        </p>
      </section>
    );
  }

  const images = imagesFor(painting);
  const multiple = images.length > 1;
  const subject = encodeURIComponent(`Enquiry about "${painting.title}"`);

  const onError = (e: React.SyntheticEvent<HTMLImageElement>) => {
    e.currentTarget.src = placeholder(painting.title, painting.orientation);
  };

  return (
    <article className="work-page">
      <a className="work-back" href="#/gallery">
        ‹ Back to gallery
      </a>

      <div className="work-layout">
        <div className="work-media">
          <div className={`work-frame ${painting.orientation}`}>
            <img
              src={images[index]}
              alt={`${painting.title}${multiple ? ` — version ${index + 1} of ${images.length}` : ''}`}
              onError={onError}
            />
          </div>

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
    </article>
  );
}

function NavBar({ page }: { page: Page }) {
  const links: { id: Page; label: string }[] = [
    { id: 'about', label: 'About Us' },
    { id: 'gallery', label: 'Gallery' },
    { id: 'contact', label: 'Contact Us' },
  ];
  return (
    <header className="navbar">
      <a className="brand" href="#/gallery">
        <span className="brand-text">කෙහෙල් මල</span>
        <img src={logo} alt="kehel mala" />
        <span className="brand-text">kehel mala</span>
        <h1 className="visually-hidden">🍌 කෙහෙල් මල 🍌 kehel mala 🍌 banana flower 🍌</h1>
      </a>
      <nav className="nav-links">
        {links.map((l) => (
          <a key={l.id} href={`#/${l.id}`} className={page === l.id ? 'active' : ''}>
            {l.label}
          </a>
        ))}
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

function GalleryPage() {
  const [open, setOpen] = useState(false);
  const [selected, setSelected] = useState<Tag[]>([]);
  const [sort, setSort] = useState<Sort>('featured');

  const toggle = (t: Tag) =>
    setSelected((s) => (s.includes(t) ? s.filter((x) => x !== t) : [...s, t]));

  const selArtists = selected.filter((t) => ARTIST_TAGS.includes(t));
  const selMediums = selected.filter((t) => MEDIUM_TAGS.includes(t));

  // Within a group, match ANY selected tag; across groups, match ALL groups (Outré-style).
  const filtered = paintings.filter((p) => {
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
      <h2 className="page-title gallery-title">Gallery</h2>
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
        <p className="no-results">No works match these filters.</p>
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
  const slug = raw as Page;
  return { kind: 'page', page: PAGES.includes(slug) ? slug : 'gallery' };
}

function App() {
  const [route, setRoute] = useState<Route>(routeFromHash());

  useEffect(() => {
    const onHashChange = () => {
      setRoute(routeFromHash());
      window.scrollTo(0, 0);
    };
    window.addEventListener('hashchange', onHashChange);
    return () => window.removeEventListener('hashchange', onHashChange);
  }, []);

  // A work detail page lives under the gallery, so keep the Gallery nav link active.
  const navPage: Page = route.kind === 'work' ? 'gallery' : route.page;

  return (
    <div className="App">
      <NavBar page={navPage} />

      <div className="content">
        {route.kind === 'work' && <WorkPage key={route.id} id={route.id} />}
        {route.kind === 'page' && route.page === 'about' && <AboutPage />}
        {route.kind === 'page' && route.page === 'gallery' && <GalleryPage />}
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
