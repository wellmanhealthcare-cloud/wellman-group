import Navbar from '@/components/layout/Navbar';
import Footer from '@/components/layout/Footer';
import WhatsAppButton from '@/components/layout/WhatsAppButton';
import HeroSlider from '@/components/home/HeroSlider';
import StatsBar from '@/components/home/StatsBar';
import AboutSnippet from '@/components/home/AboutSnippet';
import ServicesOverview from '@/components/home/ServicesOverview';
import FeaturedProjects from '@/components/home/FeaturedProjects';
import ClientLogos from '@/components/home/ClientLogos';
import Testimonials from '@/components/home/Testimonials';

export default function HomePage() {
  return (
    <>
      <Navbar />
      <main>
        <HeroSlider />
        <StatsBar />
        <AboutSnippet />
        <ServicesOverview />
        <FeaturedProjects />
        <ClientLogos />
        <Testimonials />
      </main>
      <Footer />
      <WhatsAppButton />
    </>
  );
}
