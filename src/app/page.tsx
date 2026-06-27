import Experience from '@/components/landing/Experience';
import FeaturedProjects from '@/components/landing/FeaturedProjects';
import Github from '@/components/landing/Github';
import Hero from '@/components/landing/Hero';
import TechStack from '@/components/landing/TechStack';
import WorkTogether from '@/components/landing/WorkTogether';

export default function page() {
  return (
    <main className="relative z-10">
      <section className="mb-0 min-h-screen pt-30 pb-12 md:pt-36">
        <Hero />
        <Github />
        <TechStack />
        <FeaturedProjects />
        <Experience />
        <WorkTogether />
      </section>
    </main>
  );
}
