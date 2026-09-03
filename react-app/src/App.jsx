import { useEffect } from 'react';
import { useTheme } from './hooks/useTheme.js';
import { useScrollReveal } from './hooks/useScrollReveal.js';
import Header from './components/Header.jsx';
import Hero from './components/Hero.jsx';
import Services from './components/Services.jsx';
import Why from './components/Why.jsx';
import Process from './components/Process.jsx';
import Pricing from './components/Pricing.jsx';
// Referenzen ausgeblendet (noch keine Referenzen) – zum Einblenden Import + <Referenzen /> wieder aktivieren
// import Referenzen from './components/Referenzen.jsx';
import RequestForm from './components/RequestForm.jsx';
import Faq from './components/Faq.jsx';
import Contact from './components/Contact.jsx';
import Footer from './components/Footer.jsx';
import BackToTop from './components/BackToTop.jsx';

export default function App() {
  const { theme, toggle } = useTheme();
  useScrollReveal();

  // Logo-Splash sanft ausblenden, sobald die App gemountet ist
  useEffect(() => {
    const pl = document.getElementById('preloader');
    if (!pl) return undefined;
    const reduced = window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    const minVisible = reduced ? 300 : 1100;
    let done = false;
    const hide = () => {
      if (done) return;
      done = true;
      pl.classList.add('hide');
      window.setTimeout(() => { pl.style.display = 'none'; }, 650);
    };
    // Ab Navigationsstart messen, nicht ab dem Mount: sonst wird das Intro
    // auf langsamen Verbindungen doppelt so lange gezeigt wie geplant.
    const elapsed = window.performance && performance.now ? performance.now() : 0;
    const timer = window.setTimeout(hide, Math.max(0, minVisible - elapsed));
    const safety = window.setTimeout(hide, 3500);
    return () => { window.clearTimeout(timer); window.clearTimeout(safety); };
  }, []);

  return (
    <>
      <a className="skip-link" href="#start">Zum Inhalt springen</a>

      <Header theme={theme} onToggleTheme={toggle} />

      <main>
        <Hero />
        <Services />
        <Why />
        <Process />
        <Pricing />
        {/* <Referenzen /> ausgeblendet, bis es Referenzen gibt */}
        <RequestForm />
        <Faq />
        <Contact />
      </main>

      <Footer />
      <BackToTop />
    </>
  );
}
