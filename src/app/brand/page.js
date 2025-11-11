export default function Brand() {
  return (
    <div className="w-full bg-[rgb(245,240,230)] text-[rgb(101,67,33)] font-serif leading-normal overflow-x-hidden">
      {/* Hero Section */}
      <div className="mb-[80px]">
        <div
          className="relative w-full h-[300px] sm:h-[450px] md:h-[500px] bg-cover bg-center bg-no-repeat"
          style={{
            backgroundImage: 'url("/image/promise2.jpg")',
          }}
        >
          <div className="absolute inset-0 bg-[rgba(0,0,0,0.25)]"></div>

          {/* ✅ 모바일에서는 텍스트 위치를 위로 (pt 조정) */}
          <div className="relative max-w-[1320px] mx-auto px-6 pt-[20px] sm:pt-[50px]">
            <h2 className="text-[26px] sm:text-[34px] text-[#f8f5f0] leading-[1.4] font-bold mb-5 drop-shadow-md">
              <span className="text-[#f1dfcf]">Memoriam</span>
            </h2>

            <p className="text-[16px] sm:text-[18px] text-[#f8f5f0] leading-[1.7] mb-3">
              함께한 시간이 너무도 짧게만 느껴지던 순간, 우리는 알게 되었습니다.
              <br className="hidden sm:block" />
              이별에도 준비가 필요하다는 것을, 그리고 그 준비는 사랑의 또 다른
              이름이어야 한다는 것을.
            </p>

            <p className="text-[16px] sm:text-[18px] text-[#f8f5f0] leading-[1.7]">
              Memoriam은 반려가족과의 마지막 시간을 따뜻하게 지키며 마음속 깊이
              남을 추억을 함께 만들어갑니다.
            </p>
          </div>
        </div>
      </div>

      {/* Section 1 */}
      <div className="max-w-[1324px] mx-auto px-6 mb-[100px] flex flex-col md:flex-row items-center gap-[30px] md:gap-[52px]">
        <div className="flex-1 order-2 md:order-1">
          <h2 className="font-bold text-2xl sm:text-4xl leading-[1.4] mb-6">
            추억을 보관하는 공간, Memoriam
          </h2>
          <p className="text-base sm:text-lg mb-4 leading-[1.7] text-[#7b5449]">
            소중한 순간들을 기억하고, 사랑하는 마음을 담아 언제든 다시 찾아볼 수
            있는 공간을 제공합니다.
          </p>
          <p className="text-base sm:text-lg leading-[1.7] text-[#7b5449]">
            함께한 시간을 추억하며, 기억 속 소중한 순간들을 안전하게 보관합니다.
          </p>
        </div>

        <div className="flex-1 h-[250px] sm:h-[367px] order-1 md:order-2">
          <img
            src="/image/hoi.jpg"
            alt="추억의 동물"
            className="w-full h-full object-cover rounded-lg shadow-md"
          />
        </div>
      </div>

      {/* Section 2: 우리의 약속 */}
      <div className="bg-[rgb(235,222,207)] py-[80px] sm:py-[100px] mb-[100px] text-center px-6 rounded-lg">
        <span className="block text-sm sm:text-[15px] mb-[10px] font-medium text-[rgb(133,94,66)]">
          우리의 약속
        </span>
        <h3 className="font-bold text-xl sm:text-2xl mb-4">
          Memoriam은 마음을 다해 기억을 지킵니다.
        </h3>
        <p className="text-[14px] sm:text-[15px] leading-6 mb-[45px]">
          추억을 소중히 보관하고, 언제든 다시 찾아볼 수 있는 안전한 공간을
          제공합니다.
          <br className="hidden sm:block" />
          우리는 보호자님의 마음을 이해하며, 기억을 소중하게 지켜드립니다.
        </p>

        <ul className="flex flex-col sm:flex-row justify-center items-center gap-[42px]">
          {[1, 2, 3].map((index) => (
            <li
              key={index}
              className="w-full sm:w-[320px] md:w-[412px] relative text-left"
            >
              <img
                src={`/image/promise${index}.jpg`}
                alt={`Memoriam promise ${index}`}
                className="w-full h-[250px] sm:h-[350px] object-cover mb-[21px] rounded-lg shadow-sm"
              />

              {/* ✅ 모바일에서만 글씨 살짝 위로 (bottom 조정) */}
              <span className="absolute bottom-[80px] sm:bottom-[60px] left-[20px] sm:left-[30px] text-white text-[16px] sm:text-[17px] font-medium drop-shadow-lg leading-[1.5]">
                {index === 1 && (
                  <>
                    단순한 장례가 아닌 <br />
                    <span className="font-semibold text-[17px]">
                      "진정한 교감"
                    </span>
                  </>
                )}
                {index === 2 && (
                  <>
                    따뜻한 마음을 담습니다. <br />
                    <span className="font-semibold text-[17px]">
                      "소중한 기록"
                    </span>
                  </>
                )}
                {index === 3 && (
                  <>
                    기억을 지키는 <br />
                    <span className="font-semibold text-[17px]">
                      "친절한 전문성"
                    </span>
                  </>
                )}
              </span>

              <div className="text-[14px] sm:text-[15px] text-[rgb(101,67,33)] mt-[15px] leading-[1.6]">
                {index === 1 && (
                  <>
                    ✔︎ 보호자의 감정을 공감하고 이해합니다.
                    <br />
                    ✔︎ 진심 어린 교감을 통해 따뜻한 추억을 남깁니다.
                  </>
                )}
                {index === 2 && (
                  <>
                    ✔︎ 추억을 소중히 담아 안전하게 보관합니다.
                    <br />
                    ✔︎ 언제든 다시 볼 수 있는 공간을 제공합니다.
                  </>
                )}
                {index === 3 && (
                  <>
                    ✔︎ 상담부터 절차까지 전문적으로 진행합니다.
                    <br />
                    ✔︎ 따뜻함과 신뢰를 바탕으로 함께합니다.
                  </>
                )}
              </div>
            </li>
          ))}
        </ul>
      </div>

      {/* 디지털추모관 */}
      <div className="text-center px-6 mb-[100px]">
        <h3 className="font-bold text-[#2a303c] text-2xl sm:text-[30px] leading-[1.4] mb-[30px]">
          사랑을 기억하는 곳,
          <br className="sm:hidden" />
          Memoriam 디지털추모관
        </h3>

        <div className="flex flex-col sm:flex-row justify-center gap-[20px] sm:gap-[30px] mb-[40px]">
          {[1, 2, 3].map((i) => (
            <div
              key={i}
              className="w-full sm:w-[300px] md:w-[556px] h-[220px] sm:h-[345px] overflow-hidden rounded-[10px] shadow-md"
            >
              <img
                src={`/image/dc${i}.jpg`}
                alt={`디지털추모관 ${i}`}
                className="w-full h-full object-cover rounded-[10px]"
              />
            </div>
          ))}
        </div>

        <a
          href="/service/memoriam"
          className="font-serif text-[16px] sm:text-[18px] font-medium px-[32px] sm:px-[42px] py-[12px] sm:py-[13px]
            rounded-full text-[#fffaf5] bg-gradient-to-r from-[#7b5449] to-[#a67b68] shadow-md
            transition-all duration-300 hover:scale-[1.05] hover:brightness-[1.05] hover:translate-y-[-2px]"
        >
          디지털추모관 바로가기
        </a>
      </div>
    </div>
  );
}
