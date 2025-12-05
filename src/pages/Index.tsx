import Navbar from "@/components/landing/Navbar";
import HeroSection from "@/components/landing/HeroSection";
import TrustedBySection from "@/components/landing/TrustedBySection";
import FeaturesSection from "@/components/landing/FeaturesSection";
import DeepDiveAttendance from "@/components/landing/DeepDiveAttendance";
import DeepDiveTasks from "@/components/landing/DeepDiveTasks";
import DeepDivePayroll from "@/components/landing/DeepDivePayroll";
import WhyWorkOSSection from "@/components/landing/WhyWorkOSSection";
import WorkflowSection from "@/components/landing/WorkflowSection";
import TestimonialsSection from "@/components/landing/TestimonialsSection";
import PricingSection from "@/components/landing/PricingSection";
import CTASection from "@/components/landing/CTASection";
import Footer from "@/components/landing/Footer";

const Index = () => {
  return (
    <main className="min-h-screen bg-background overflow-hidden">
      <Navbar />
      <HeroSection />
      <TrustedBySection />
      <FeaturesSection />
      <DeepDiveAttendance />
      <DeepDiveTasks />
      <DeepDivePayroll />
      <WhyWorkOSSection />
      <WorkflowSection />
      <TestimonialsSection />
      <PricingSection />
      <CTASection />
      <Footer />
    </main>
  );
};

export default Index;