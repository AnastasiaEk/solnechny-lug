import About from './components/About';
import ContactForm from './components/ContactForm';
import Faq from './components/Faq';
import Footer from './components/Footer';
import Gallery from './components/Gallery';
import Hero from './components/Hero';
import Infrastructure from './components/Infrastructure';
import LandscapeBackdrop from './components/LandscapeBackdrop';
import LeafCursor from './components/LeafCursor';
import MapBlock from './components/MapBlock';
import Navbar from './components/Navbar';
import Nearby from './components/Nearby';
import Plans from './components/Plans';
import Price from './components/Price';
import Specs from './components/Specs';
import Why from './components/Why';

export default function App() {
  return (
    <div className="min-h-dvh text-white">
      <a
        href="#main"
        className="sr-only focus:not-sr-only focus:absolute focus:left-4 focus:top-4 focus:z-50 focus:rounded-lg focus:bg-white focus:px-4 focus:py-2 focus:text-black"
      >
        Перейти к содержанию
      </a>

      <LandscapeBackdrop />
      <LeafCursor />
      <Navbar />
      <Hero />

      {/* relative z-10 — иначе фиксированный слой силуэтов накроет контент:
          позиционированные элементы рисуются позже обычного потока. */}
      <main id="main" className="relative z-10">
        <Specs />
        <Why />
        <Nearby />
        <About />
        <Gallery />
        <Plans />
        <Price />
        <MapBlock />
        <Infrastructure />
        <Faq />
        <ContactForm />
      </main>

      <Footer />
    </div>
  );
}
