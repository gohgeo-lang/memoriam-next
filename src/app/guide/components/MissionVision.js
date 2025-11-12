export default function MissionVision() {
  return (
    <section className="relative bg-gradient-to-b from-white to-gray-500 py-16 px-6 md:px-20">
      <div className="max-w-5xl mx-auto text-center">
        {/* 미션 */}
        <h2 className="text-3xl md:text-4xl font-extrabold text-gray-800 mb-6">
          우리의 <span className="text-indigo-600">미션</span>
        </h2>
        <p className="text-lg md:text-xl text-gray-600 leading-relaxed mb-16">
          반려동물과의 마지막 이별을 존엄하고 아름답게 만들어드립니다.
          <br />
          <span className="font-semibold text-gray-700">memoriam</span> 은
          반려가족의 아픔을 함께 나누고, 소중한 추억을 영원히 간직할 수 있도록
          돕는 것을 사명으로 삼고 있습니다.
        </p>

        {/* 비전 */}
        <div className="bg-white shadow-xl rounded-2xl p-10 md:p-16">
          <h2 className="text-3xl md:text-4xl font-extrabold text-gray-800 mb-6">
            우리의 <span className="text-indigo-600">비전</span>
          </h2>
          <p className="text-lg md:text-xl text-gray-600 leading-relaxed">
            대한민국 모든 반려동물이 존엄한 마지막을 맞이할 수 있도록,
            <br />
            <span className="font-semibold text-indigo-700">
              전국적인 프리미엄 장례 서비스 네트워크
            </span>
            를 구축하겠습니다.
          </p>
        </div>
      </div>
    </section>
  );
}
