import { FaPaw } from "react-icons/fa";

const costs = [
  { size: "소형", price: "10만원 ~ 20만원" },
  { size: "중형", price: "20만원 ~ 30만원" },
  { size: "대형", price: "30만원 ~ 50만원" },
];

export default function CostGuide() {
  return (
    <section className="py-12 lg:py-16 bg-gray-50">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <h2 className="text-3xl font-bold text-center mb-12">비용 안내</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {costs.map((item, idx) => (
            <div
              key={idx}
              className="bg-white p-8 rounded-2xl shadow-lg hover:shadow-2xl transition transform hover:-translate-y-2 text-center"
            >
              <FaPaw
                size={16 * (idx + 1)}
                className="text-indigo-600 mb-3 mx-auto"
              />
              <h3 className="text-xl font-semibold mb-2">{item.size}</h3>
              <p className="text-gray-700">{item.price}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
