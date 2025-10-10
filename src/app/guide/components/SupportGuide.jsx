export default function SupportGuide() {
  return (
    <section className="py-12 lg:py-20 bg-indigo-50">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col md:flex-row items-center gap-8">
        <img
          src="/images/support.png"
          alt="심리 지원"
          className="w-full md:w-1/2 rounded-2xl shadow-lg"
        />
        <div className="md:w-1/2 text-center md:text-left">
          <h2 className="text-3xl font-bold text-indigo-800 mb-4">
            심리적 지원 안내
          </h2>
          <p className="text-gray-700 text-lg md:text-xl leading-relaxed">
            반려동물 상실로 인한 슬픔과 아픔을 이해하며, 전문 상담과 추모 공간을
            안내해드립니다.
          </p>
        </div>
      </div>
    </section>
  );
}
