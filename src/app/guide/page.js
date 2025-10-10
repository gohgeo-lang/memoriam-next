import CostGuide from "./components/CostGuide";
import CTASection from "./components/CTASection";
import FAQ from "./components/FAQ";
import HeroSection from "./components/HeroSection";
import MissionVision from "./components/MissionVision";
import ProcedureSteps from "./components/ProcedureGuide";
import ServiceGuide from "./components/ServiceGuide";
import SupportGuide from "./components/SupportGuide";

export default function GuidePage() {
  return (
    <>
      <HeroSection />

      {/* 절차 안내 */}
      <ProcedureSteps />

      {/* 서비스 안내 */}
      <ServiceGuide />

      {/* 비용 안내 */}
      <CostGuide />

      {/* 심리 상담 */}
      <SupportGuide />

      {/* FAQ */}
      <FAQ />

      {/* 미션/비전 지우기 또는 위치 변경 */}
      <MissionVision />

      {/* 상담 CTA */}
      <CTASection />
    </>
  );
}
