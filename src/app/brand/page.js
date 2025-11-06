export default function Brand() {
  return (
    <div className="w-full p-0 m-0 bg-[rgb(245,240,230)] text-[rgb(101,67,33)] font-serif leading-normal">
      {/* Hero Section */}
      <div className="mb-[100px]">
        <div
          className="relative w-full max-w-[1728px] aspect-[16/9] bg-cover bg-center bg-no-repeat"
          style={{
            backgroundImage: 'url("/image/sad1.jpg")',
          }}
        >
          {/* 어두운 오버레이 (글씨 가독성용) */}
          <div className="absolute inset-0 bg-[rgba(0,0,0,0.25)] rounded-b-lg"></div>

          {/* 텍스트 영역 */}
          <div className="relative w-[1320px] max-w-[1320px] pt-[117px] mx-[204px]">
            <h2 className="text-[34px] text-[#f8f5f0] leading-[48px] text-left font-bold mb-[35px] font-serif drop-shadow-md">
              <span className="text-[#f1dfcf]">Memoriam</span>
            </h2>

            <p className="font-normal text-[18px] leading-[30px] text-[#f8f5f0] text-left block mb-5">
              함께한 시간이 너무도 짧게만 느껴지던 순간, 우리는 알게 되었습니다.
              <br />
              이별에도 준비가 필요하다는 것을, 그리고 그 준비는 사랑의 또 다른
              이름이어야 한다는 것을.
            </p>

            <p className="font-normal text-[18px] leading-[30px] text-[#f8f5f0] text-left block">
              Memoriam은 반려가족과의 마지막 시간을 따뜻하게 지키며 마음속 깊이
              남을 추억을 함께 만들어갑니다.
            </p>
          </div>
        </div>
      </div>

      {/* Hero Section */}
      <div className="max-w-[1324px] mx-[202px] mb-[100px] flex items-center gap-[52px] pt-[80px]">
        <div className="flex-1">
          <h2 className="font-serif font-bold text-4xl leading-[48px] mb-[35px]">
            추억을 보관하는 공간, Memoriam
          </h2>
          <p className="text-lg mb-5 leading-[28px] text-[#7b5449]">
            소중한 순간들을 기억하고, 사랑하는 마음을 담아
            <br />
            언제든 다시 찾아볼 수 있는 공간을 제공합니다.
          </p>
          <p className="text-lg leading-[28px] text-[#7b5449]">
            함께한 시간을 추억하며,
            <br />
            기억 속 소중한 순간들을 안전하게 보관합니다.
          </p>
        </div>

        <div className="flex-1 h-[367px]">
          <img
            src="/image/dog1.jpg"
            alt="추억의 동물"
            className="w-full h-full object-cover rounded-lg shadow-md"
          />
        </div>
      </div>

      {/* Section 1 */}
      <div className="max-w-[1324px] mx-[202px] mb-[90px]">
        <div className="flex items-center mb-[58px]">
          <div className="relative w-[634px] h-[367px]">
            <img
              src="https://fourpaws.co.kr/img/new-brand-section01-01.png"
              alt=""
              className="absolute top-0 left-0 w-full h-full object-cover rounded-lg shadow-md"
            />
          </div>
          <div className="ml-[52px]">
            <span className="block text-[15px] mb-[10px] font-medium text-[rgb(133,94,66)]">
              우리의 시작
            </span>
            <h3 className="font-bold text-2xl mb-7 font-serif">
              추억을 안전하게, 사랑을 담아
            </h3>
            <p className="text-[15px] mb-[18px] leading-6">
              Memoriam은 소중한 순간들을 지켜주고자 시작되었습니다.
            </p>
            <p className="text-[15px] mb-[18px] leading-6">
              기억을 기록하고, 사진과 영상, 메시지를 통해 언제든 다시 볼 수 있는
              공간을 제공합니다.
            </p>
            <p className="text-[15px] leading-6">
              사랑하는 사람과의 추억을 안전하고 따뜻하게 보관하는 것이 우리의
              목표입니다.
            </p>
          </div>
        </div>
      </div>

      {/* Section 2: 우리의 약속 */}
      <div className="bg-[rgb(235,222,207)] py-[100px] mb-[120px] text-center rounded-lg">
        <span className="block text-[15px] mb-[10px] font-medium text-[rgb(133,94,66)]">
          우리의 약속
        </span>
        <h3 className="font-bold text-2xl mb-4 font-serif">
          Memoriam은 마음을 다해 기억을 지킵니다.
        </h3>
        <p className="text-[15px] leading-6 mb-[45px]">
          추억을 소중히 보관하고, 언제든 다시 찾아볼 수 있는 안전한 공간을
          제공합니다.
          <br />
          우리는 보호자님의 마음을 이해하며, 기억을 소중하게 지켜드립니다.
        </p>

        {/* ✅ 이미지 + 텍스트 + 설명 */}
        <ul className="flex justify-center gap-[42px]">
          {[1, 2, 3].map((index) => (
            <li key={index} className="w-[412px] relative text-left">
              {/* 이미지 */}
              <img
                src={`/image/promise${index}.jpg`}
                alt={`Memoriam promise ${index}`}
                className="w-full h-[350px] object-cover mb-[21px] rounded-lg shadow-sm"
              />

              {/* 왼쪽 아래 문구 */}
              <span className="absolute bottom-[80px] left-[30px] text-white text-[17px] font-medium drop-shadow-lg leading-[1.5]">
                {index === 1 && (
                  <>
                    단순한 장례가 아닌 <br />
                    <span className="font-semibold text-[18px]">
                      "진정한 교감"
                    </span>
                  </>
                )}
                {index === 2 && (
                  <>
                    따뜻한 마음을 담습니다.
                    <br />
                    <span className="font-semibold text-[18px]">
                      "소중한 기록"
                    </span>
                  </>
                )}
                {index === 3 && (
                  <>
                    기억을 지키는 <br />
                    <span className="font-semibold text-[18px]">
                      "친절한 전문성"
                    </span>
                  </>
                )}
              </span>

              {/* ✅ 사진 밑 설명 */}
              <div className="text-[15px] text-[rgb(101,67,33)] mt-[15px] leading-[1.6]">
                {index === 1 && (
                  <>
                    ✔︎ 보호자의 감정을 상세하게 공감하고 이해합니다.
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
      {/* ✅ Service Introduction Section 추가 */}
      <div className="block max-w-[1340px] w-[1340px] mx-[194px] mb-[140px]">
        <div className="flex justify-between">
          <div className="w-[670px]">
            <span className="font-normal block text-left text-[#7b5449] text-base leading-[21px] mb-[10px]">
              서비스 소개
            </span>
            <h3 className="font-bold block text-left text-[#7b5449] text-2xl leading-[34px] mb-4">
              많은 보호자들이 선택한 <br />
              반려동물 장례 서비스 'Memoriam'
            </h3>
            <p className="font-normal block text-left text-[#7b5449] text-[15px] leading-6">
              단순한 장례가 아닌, 의미 있는 이별의 여정.
              <br />
              Memoriam은 보호자님과 반려동물의 마지막 시간을
              <br />
              가장 따뜻하게 만들어드립니다.
            </p>
          </div>

          <div className="w-[670px] pt-[100px]">
            <ul>
              <li className="font-medium border-b border-[#999999] pb-[25px] mb-[25px]">
                <span className="text-[15px] text-[#7b5449] block leading-[23px] text-left">
                  누적 장례 진행 건 수
                </span>
                <p className="font-bold text-[28.5px] text-[#7b5449] leading-[34.5px] text-right">
                  100,000 +
                </p>
              </li>
              <li className="font-medium">
                <span className="text-[15px] text-[#7b5449] block leading-[23px] text-left">
                  전국 Memoriam 지점 수
                  <span className="block text-[#7b5449] text-xs leading-[23px] mt-[3px]">
                    * 전국 주요 도시 상담 가능
                  </span>
                </span>
                <p className="font-bold text-[28.5px] text-[#7b5449] leading-[34.5px] text-right -mt-[25px]">
                  4개 지점
                </p>
              </li>
            </ul>
          </div>
        </div>
      </div>
      {/* Blissland Section */}
      <div className="mb-[120px]">
        <h3 className="font-bold text-[#2a303c] text-[30px] leading-[43px] text-center mb-[30px]">
          사랑을 기억하는는 곳,
          <br />
          Memoriam 디지털추모관
        </h3>
        <div>
          <div className="relative overflow-clip z-[1] block touch-pan-y w-[1728px] mb-10">
            <div className="relative w-[1728px] h-[345px] z-[1] flex transition-transform duration-0 ease-[ease]">
              <div className="flex-shrink-0 w-[556px] h-[345px] relative block text-center overflow-hidden rounded-[10px] mr-[30px]">
                <div>
                  <img
                    src="https://fourpaws.co.kr/img/new-brand-section05-01.png"
                    alt=""
                    className="w-[556px] h-[342px] object-cover rounded-[10px]"
                  />
                </div>
              </div>
              <div className="flex-shrink-0 w-[556px] h-[345px] relative block text-center overflow-hidden rounded-[10px] mr-[30px]">
                <div>
                  <img
                    src="https://fourpaws.co.kr/img/new-brand-section05-02.png"
                    alt=""
                    className="w-[556px] h-[342px] object-cover rounded-[10px]"
                  />
                </div>
              </div>
              <div className="flex-shrink-0 w-[556px] h-[345px] relative block text-center overflow-hidden rounded-[10px] mr-[30px]">
                <div>
                  <img
                    src="https://fourpaws.co.kr/img/new-brand-section05-03.png"
                    alt=""
                    className="w-[556px] h-[342px] object-cover rounded-[10px]"
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
        <div className="flex justify-center w-[1728px]">
          <a
            href="service/memoriam"
            className="
      font-serif
      text-[18px]
      font-medium
      px-[42px]
      py-[13px]
      rounded-full
      text-[#fffaf5]
      bg-gradient-to-r from-[#7b5449] to-[#a67b68]
      shadow-md
      transition-all
      duration-300
      ease-in-out
      hover:shadow-[0_0_15px_rgba(166,123,104,0.6)]
      hover:scale-[1.05]
      hover:brightness-[1.05]
      hover:translate-y-[-2px]
      whitespace-nowrap
    "
          >
            디지털추모관 바로가기
          </a>
        </div>
      </div>
    </div>
  );
}
