import React from 'react';
import './App.css';
import logo from './logo.svg';
import { paintings, Painting, Orientation } from './paintings';

// Soft placeholder shown until a real image file exists at the given path.
function placeholder(title: string, orientation: Orientation): string {
  const [w, h] = orientation === 'landscape' ? [800, 600] : [600, 800];
  const svg = `<svg xmlns='http://www.w3.org/2000/svg' width='${w}' height='${h}'>
    <rect width='100%' height='100%' fill='#ece9e4'/>
    <text x='50%' y='50%' fill='#b3a89a' font-family='Georgia, serif'
      font-size='28' text-anchor='middle' dominant-baseline='middle'>${title}</text>
  </svg>`;
  return `data:image/svg+xml;utf8,${encodeURIComponent(svg)}`;
}

function GalleryImage({ painting }: { painting: Painting }) {
  const onError = (e: React.SyntheticEvent<HTMLImageElement>) => {
    const img = e.currentTarget;
    if (img.dataset.fallback) return; // avoid loop if placeholder also fails
    img.dataset.fallback = 'true';
    img.src = placeholder(painting.title, painting.orientation);
  };

  return (
    <figure className={`piece ${painting.orientation}`}>
      <div className="piece-frame">
        <img src={painting.image} alt={painting.title} loading="lazy" onError={onError} />
      </div>
      <figcaption className="piece-caption">
        {painting.artist && <span className="piece-artist">{painting.artist}</span>}
        <span className="piece-title">{painting.title}</span>
        {painting.medium && <span className="piece-meta">{painting.medium}</span>}
      </figcaption>
    </figure>
  );
}

function App() {
  return (
    <div className="App">
      <header className="site-header">
        <img className="site-logo" src={logo} alt="kehel mala — banana flower" />
        <h1 className="visually-hidden">🍌 කෙහෙල් මල 🍌 kehel mala 🍌 banana flower 🍌</h1>
      </header>

      <section id="about" className="about">
        <p className="site-desc">
          The various creative pursuits of the Sri Lankan sibling duo Milindi and Chaamudi
          Kodikara, yet another couple of brown engineers living in Melbourne trying to do
          anything but their jobs 💅🏾
        </p>
      </section>

      <main id="gallery" className="gallery">
        {paintings.map((p) => (
          <GalleryImage key={p.id} painting={p} />
        ))}
      </main>

      <footer className="site-footer">
        <section className="dictionary">
          <p className="dict-headword">
            <strong>kehel mala</strong>
          </p>
          <p className="dict-etymology">
            [<em>Sri Lankan slang, from <strong>kehel</strong> banana
            + <strong>mala</strong> flower</em>]
          </p>
          <p className="dict-def">
            <em>
              Colloquially used to mean something along the lines of "Ah shit!", "Da hell!" or to
              express strong contradiction, similar to saying "Yeah, right!" or "Mhmm" (with attitude).
            </em>
          </p>
          <p className="dict-usage">
            <strong>Usage:</strong> When your sister does some dumb shit, you say,{' '}
            "<em>Mona kehel malakda?!</em>" to convey your displeasure at them.
          </p>
        </section>

        <p className="contact">
          Contact us: <a href="mailto:milindikodikara@gmail.com">milindikodikara@gmail.com</a>
        </p>
        <p className="copyright">
          © 2026 kehel mala™ : : This site and all artwork are the property of kehel mala™.
        </p>
      </footer>
    </div>
  );
}

export default App;
