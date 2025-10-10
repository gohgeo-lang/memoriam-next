import FrameCard from "./FrameCard";

export default function ServiceGuide() {
  return (
    <>
      <section className="py-12 bg-gray-100 px-4 md:px-16">
        <h2 className="text-3xl font-bold text-center mb-12">
          서비스 종류 & 선택 가이드
        </h2>
        <div className="max-w-6xl mx-auto">
          <h3 className="text-2xl sm:text-3xl font-bold mb-6 text-center">
            합동 화장
          </h3>
          <p className="text-center text-gray-700 mb-8 sm:text-lg">
            여러 반려동물을 함께 보내며, 존엄하게 마지막을 맞이할 수 있는
            서비스입니다.
          </p>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 items-center">
            <div className="rounded-2xl overflow-hidden shadow-lg">
              <FrameCard>
                <img
                  src="/img/group-cremation.jpg"
                  alt="합동 화장"
                  className="w-full h-64 sm:h-80 md:h-96 object-cover"
                />
              </FrameCard>
            </div>
            <div className="p-4 sm:p-6 md:p-8">
              <p className="text-gray-700 mb-4">
                합동 화장은 가족과 함께하는 장례가 어려운 경우, 부담 없이 선택할
                수 있으며, 고인을 존중하는 마음으로 진행됩니다.
              </p>
              <p className="text-gray-700">
                상징적인 이미지와 차분한 분위기를 통해 유가족이 마음의 위안을
                얻을 수 있도록 도와드립니다.
              </p>
            </div>
          </div>
        </div>
      </section>

      <section className="py-12 bg-white px-4 md:px-16">
        <div className="max-w-6xl mx-auto">
          <h3 className="text-2xl sm:text-3xl font-bold mb-6 text-center">
            개별 화장
          </h3>
          <p className="text-center text-gray-700 mb-8 sm:text-lg">
            소중한 반려동물을 가족처럼 정성껏 보내드리는 1:1 화장 서비스입니다.
          </p>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 items-center">
            <div className="p-4 sm:p-6 md:p-8">
              <p className="text-gray-700 mb-4">
                개별 화장은 모든 과정을 고객님이 직접 확인 가능하며, 유골은
                안전하게 전달됩니다.
              </p>
              <p className="text-gray-700">
                존엄성과 추억을 최우선으로 하여, 평화롭고 안심할 수 있는 환경을
                제공합니다.
              </p>
            </div>
            <div className="rounded-2xl overflow-hidden shadow-lg">
              <FrameCard>
                <img
                  src="/img/individual-cremation.jpg"
                  alt="개별 화장"
                  className="w-full h-64 sm:h-80 md:h-96 object-cover"
                />
              </FrameCard>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
