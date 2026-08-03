import Hero from "@/components/home/Hero";
import WhyChoose from "@/components/home/WhyChoose";
import TopDoctors from "@/components/home/TopDoctors";
import ReviewsFeedback from "@/components/home/ReviewsFeedback ";
import HealthStats from "@/components/home/HealthStats";
import FaqAccordion from "@/components/home/FaqAccordion";

export default function Home() {
  return (
    <main>
      <Hero/>
      <TopDoctors/>
      <WhyChoose/>
      <ReviewsFeedback/>
      <HealthStats/>
      <FaqAccordion/>
    </main>
  );
}
