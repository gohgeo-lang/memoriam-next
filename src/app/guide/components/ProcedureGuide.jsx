// npm install react-icons
import {
  FaPhoneAlt,
  FaTruck,
  FaRibbon,
  FaRegHeart,
  FaFire,
  FaRegFileAlt,
} from "react-icons/fa";

const steps = [
  {
    number: "01",
    title: "장례 업체 예약",
    desc: "반려동물 장례 업체에 전화나 온라인으로 예약합니다. 방문 후 담당 지도사와 장례 방법 및 용품을 상담합니다.",
    icon: <FaPhoneAlt size={32} className="text-indigo-600 mb-3" />,
  },
  {
    number: "02",
    title: "염습 및 입관",
    desc: "반려동물의 몸을 닦고 정리하는 염습 과정 진행 후, 의복을 입히고 관에 안치합니다.",
    icon: <FaRegHeart size={32} className="text-indigo-600 mb-3" />,
  },
  {
    number: "03",
    title: "추모식 및 마지막 인사",
    desc: "단독 빈소에서 보호자와 반려동물이 마지막 인사를 나눕니다.",
    icon: <FaRibbon size={32} className="text-indigo-600 mb-3" />,
  },
  {
    number: "04",
    title: "화장 및 유골 수습",
    desc: "보호자 참관 하 개별 화장이 진행되며, 완료 후 유골을 수습하고 한지 주머니나 유골함에 담아 전달합니다.",
    icon: <FaFire size={32} className="text-indigo-600 mb-3" />,
  },
  {
    number: "05",
    title: "유골 전달 및 안치",
    desc: "유골을 안전하게 보관하며, 가정 보관, 봉안당 안치, 루세트 스톤 등 다양한 형태로 제공됩니다.",
    icon: <FaRegHeart size={32} className="text-indigo-600 mb-3" />,
  },
  {
    number: "06",
    title: "동물등록 말소 (사망신고)",
    desc: "장례 증명서를 받아 관할 시청/구청에 사망신고를 진행합니다. 인터넷 신고도 가능하며 미신고 시 과태료가 부과됩니다.",
    icon: <FaRegFileAlt size={32} className="text-indigo-600 mb-3" />,
  },
];

export default function ProcedureSteps() {
  return (
    <section className="py-12 lg:py-16 bg-gray-50">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <h2 className="text-3xl font-bold text-center mb-12">장례 절차 안내</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {steps.map((step) => (
            <div
              key={step.number}
              className="bg-white p-8 rounded-2xl shadow-lg hover:shadow-2xl transition transform hover:-translate-y-2"
            >
              <div className="flex flex-col items-center text-center">
                {step.icon}
                <div className="text-indigo-600 text-xl font-bold mb-3">
                  {step.number}. {step.title}
                </div>
                <p className="text-gray-700">{step.desc}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
