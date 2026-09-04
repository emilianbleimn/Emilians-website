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
