export default function About() {
  return (
    <div className="w-full p-0 m-0 bg-[rgb(245,240,230)] text-[rgb(101,67,33)] font-serif leading-normal">
      {/* Hero Section: 왼쪽 텍스트 / 오른쪽 이미지 */}
      <div className="max-w-[1324px] w-[1324px] mx-[202px] mb-[100px] flex items-center gap-[52px] pt-[80px]">
        {/* 왼쪽 텍스트 */}
        <div className="flex-1">
          <h2 className="font-serif font-bold text-4xl text-[rgb(101,67,33)] leading-[48px] mb-[35px] ">
            추억을 보관하는 공간, Memoriam
          </h2>
          <p className="text-lg text-[rgb(121,85,54)] mb-5 leading-[28px]">
            소중한 순간들을 기억하고, 사랑하는 마음을 담아
            <br />
            언제든 다시 찾아볼 수 있는 공간을 제공합니다.
          </p>
          <p className="text-lg text-[rgb(121,85,54)] leading-[28px]">
            함께한 시간을 추억하며,
            <br />
            기억 속 소중한 순간들을 안전하게 보관합니다.
          </p>
        </div>

        {/* 오른쪽 이미지 */}
        <div className="flex-1 h-[367px]">
          <img
            src="/image/dog1.jpg"
            alt="추억의 동물"
            className="w-full h-full object-cover rounded-lg shadow-md"
          />
        </div>
      </div>

      {/* Section 1: 기존 내용 그대로 */}
      <div className="max-w-[1324px] w-[1324px] mx-[202px] mb-[90px]">
        <div className="flex items-center mb-[58px]">
          <div className="relative w-[634px] h-[367px]">
            <img
              src="https://fourpaws.co.kr/img/new-brand-section01-01.png"
              alt=""
              className="absolute top-0 left-0 w-full h-full object-cover rounded-lg shadow-md"
            />
          </div>
          <div className="ml-[52px]">
            <span className="block text-[rgb(133,94,66)] text-[15px] leading-[21px] mb-[10px] font-medium">
              우리의 시작
            </span>
            <h3 className="font-bold text-2xl text-[rgb(101,67,33)] leading-[34px] mb-7 font-serif">
              추억을 안전하게, 사랑을 담아
            </h3>
            <p className="text-[15px] text-[rgb(101,67,33)] leading-6 mb-[18px]">
              Memoriam은 소중한 순간들을 지켜주고자 시작되었습니다.
            </p>
            <p className="text-[15px] text-[rgb(101,67,33)] leading-6 mb-[18px]">
              기억을 기록하고, 사진과 영상, 메시지를 통해 언제든 다시 볼 수 있는
              공간을 제공합니다.
            </p>
            <p className="text-[15px] text-[rgb(101,67,33)] leading-6">
              사랑하는 사람과의 추억을 안전하고 따뜻하게 보관하는 것이 우리의
              목표입니다.
            </p>
          </div>
        </div>
      </div>

      {/* Section 2: 하단 약속 + 이미지 3개 */}
      <div className="bg-[rgb(235,222,207)] py-[100px] mb-[120px] text-center rounded-lg">
        <span className="block text-[rgb(133,94,66)] text-[15px] leading-[21px] mb-[10px] font-medium">
          우리의 약속
        </span>
        <h3 className="font-bold text-2xl text-[rgb(101,67,33)] mb-4 font-serif">
          Memoriam은 마음을 다해 기억을 지킵니다.
        </h3>
        <p className="text-[15px] text-[rgb(101,67,33)] leading-6 mb-[45px]">
          추억을 소중히 보관하고, 언제든 다시 찾아볼 수 있는 안전한 공간을
          제공합니다.
          <br />
          우리는 보호자님의 마음을 이해하며, 기억을 소중하게 지켜드립니다.
        </p>
        <ul className="flex justify-center gap-[42px]">
          {[1, 2, 3].map((index) => (
            <li key={index} className="w-[412px]">
              <img
                src={`https://fourpaws.co.kr/img/new-brand-section02-0${index}.png`}
                alt=""
                className="w-full h-[350px] object-cover mb-[21px] rounded-lg shadow-sm"
              />
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}
