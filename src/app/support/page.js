import React from "react";
export default function support() {
  return (
    <div className="w-full bg-transparent text-[rgb(42,48,60)] text-[13.6px] leading-normal font-['Roboto','Noto_Sans_KR','맑은_고딕','Malgun_Gothic',sans-serif]">
      {/* Spacer */}
      <div className="block max-w-[1320px] w-[1320px] my-5 mx-[204px]"></div>
      {/* Main Content */}
      <div className="max-w-[1320px] w-[1320px] mx-[204px]">
        {/* Title */}
        <h1 className="font-semibold text-center text-[32px] leading-[43px] tracking-[-0.1px] mb-4">
          FAQ
        </h1>
        {/* Subtitle */}
        <h2 className="font-normal text-center text-base leading-[22px] tracking-[-0.5px] text-[rgb(92,98,114)] mb-[60px]">
          자주 문의하는 질문에 대한 <br className="hidden" />
          답변을 확인하실 수 있습니다.
        </h2>
        {/* Category Filter Buttons */}
        <div className="w-[1320px]">
          <ul className="w-[1320px] flex justify-center flex-row items-center flex-wrap list-none mb-[60px] gap-3 p-0 m-0">
            <li>
              <a
                href="/service/faq"
                className="font-bold text-white block h-[50.5px] leading-[26.5px] text-lg bg-[rgb(42,48,60)] text-center tracking-[-0.5px] rounded-[50px] px-5 py-3 no-underline"
              >
                전체
              </a>
            </li>
            <li>
              <a
                href="/service/faq/1"
                className="font-bold text-[rgb(42,48,60)] block h-[50.5px] leading-[26.5px] text-lg bg-[rgb(246,247,248)] text-center tracking-[-0.5px] rounded-[50px] px-5 py-3 no-underline"
              >
                기초 수습
              </a>
            </li>
            <li>
              <a
                href="/service/faq/2"
                className="font-bold text-[rgb(42,48,60)] block h-[50.5px] leading-[26.5px] text-lg bg-[rgb(246,247,248)] text-center tracking-[-0.5px] rounded-[50px] px-5 py-3 no-underline"
              >
                장례 서비스
              </a>
            </li>
            <li>
              <a
                href="/service/faq/20"
                className="font-bold text-[rgb(42,48,60)] block h-[50.5px] leading-[26.5px] text-lg bg-[rgb(246,247,248)] text-center tracking-[-0.5px] rounded-[50px] px-5 py-3 no-underline"
              >
                차량 지원 서비스
              </a>
            </li>
            <li>
              <a
                href="/service/faq/4"
                className="font-bold text-[rgb(42,48,60)] block h-[50.5px] leading-[26.5px] text-lg bg-[rgb(246,247,248)] text-center tracking-[-0.5px] rounded-[50px] px-5 py-3 no-underline"
              >
                블리스 스톤
              </a>
            </li>
            <li>
              <a
                href="/service/faq/21"
                className="font-bold text-[rgb(42,48,60)] block h-[50.5px] leading-[26.5px] text-lg bg-[rgb(246,247,248)] text-center tracking-[-0.5px] rounded-[50px] px-5 py-3 no-underline"
              >
                봉안당
              </a>
            </li>
            <li>
              <a
                href="/service/faq/22"
                className="font-bold text-[rgb(42,48,60)] block h-[50.5px] leading-[26.5px] text-lg bg-[rgb(246,247,248)] text-center tracking-[-0.5px] rounded-[50px] px-5 py-3 no-underline"
              >
                디지털 추모
              </a>
            </li>
            <li>
              <a
                href="/service/faq/5"
                className="font-bold text-[rgb(42,48,60)] block h-[50.5px] leading-[26.5px] text-lg bg-[rgb(246,247,248)] text-center tracking-[-0.5px] rounded-[50px] px-5 py-3 no-underline"
              >
                기타
              </a>
            </li>
          </ul>
        </div>
        {/* FAQ List */}
        <div className="w-[1320px]">
          <ul className="w-[1320px] flex flex-row justify-between items-center flex-wrap list-none p-0 m-0">
            {/* FAQ Item 1 */}
            <li className="w-[1320px] flex flex-col cursor-pointer border-t border-b border-[rgb(234,236,240)] p-5">
              <span className="font-normal text-sm leading-[22px] tracking-[-0.5px] text-[rgb(92,98,114)] w-[120px] text-center">
                봉안당
              </span>
              <strong className="font-bold text-lg relative leading-[23px] tracking-[-0.5px] text-[rgb(42,48,60)] -top-[22px] left-[170px] h-0 pr-[30px]">
                포포즈 봉안당은 어떻게 이용 가능한가요?
                <span className="absolute text-lg leading-[23px] text-[rgb(42,48,60)] top-[10px] left-[1090px] h-5"></span>
              </strong>
              <div className="hidden relative mt-7 mb-2 mx-[170px] mr-[15px] pl-[23px]">
                {/* Answer content hidden by default */}
              </div>
            </li>
            {/* FAQ Item 2 */}
            <li className="w-[1320px] flex flex-col cursor-pointer border-b border-[rgb(234,236,240)] p-5">
              <span className="font-normal text-sm leading-[22px] tracking-[-0.5px] text-[rgb(92,98,114)] w-[120px] text-center">
                봉안당
              </span>
              <strong className="font-bold text-lg relative leading-[23px] tracking-[-0.5px] text-[rgb(42,48,60)] -top-[22px] left-[170px] h-0 pr-[30px]">
                봉안당 운영 시간은 어떻게 되나요?
                <span className="absolute text-lg leading-[23px] text-[rgb(42,48,60)] top-[10px] left-[1090px] h-5"></span>
              </strong>
              <div className="hidden relative mt-7 mb-2 mx-[170px] mr-[15px] pl-[23px]">
                {/* Answer content hidden by default */}
              </div>
            </li>
            {/* FAQ Item 3 */}
            <li className="w-[1320px] flex flex-col cursor-pointer border-b border-[rgb(234,236,240)] p-5">
              <span className="font-normal text-sm leading-[22px] tracking-[-0.5px] text-[rgb(92,98,114)] w-[120px] text-center">
                봉안당
              </span>
              <strong className="font-bold text-lg relative leading-[23px] tracking-[-0.5px] text-[rgb(42,48,60)] -top-[22px] left-[170px] h-0 pr-[30px]">
                실내 추모 공간이 궁금해요.
                <span className="absolute text-lg leading-[23px] text-[rgb(42,48,60)] top-[10px] left-[1090px] h-5"></span>
              </strong>
              <div className="hidden relative mt-7 mb-2 mx-[170px] mr-[15px] pl-[23px]">
                {/* Answer content hidden by default */}
              </div>
            </li>
            {/* FAQ Item 4 */}
            <li className="w-[1320px] flex flex-col cursor-pointer border-b border-[rgb(234,236,240)] p-5">
              <span className="font-normal text-sm leading-[22px] tracking-[-0.5px] text-[rgb(92,98,114)] w-[120px] text-center">
                봉안당
              </span>
              <strong className="font-bold text-lg relative leading-[23px] tracking-[-0.5px] text-[rgb(42,48,60)] -top-[22px] left-[170px] h-0 pr-[30px]">
                야외 추모 공간이 궁금해요.
                <span className="absolute text-lg leading-[23px] text-[rgb(42,48,60)] top-[10px] left-[1090px] h-5"></span>
              </strong>
              <div className="hidden relative mt-7 mb-2 mx-[170px] mr-[15px] pl-[23px]">
                {/* Answer content hidden by default */}
              </div>
            </li>
            {/* FAQ Item 5 */}
            <li className="w-[1320px] flex flex-col cursor-pointer border-b border-[rgb(234,236,240)] p-5">
              <span className="font-normal text-sm leading-[22px] tracking-[-0.5px] text-[rgb(92,98,114)] w-[120px] text-center">
                블리스 스톤
              </span>
              <strong className="font-bold text-lg relative leading-[23px] tracking-[-0.5px] text-[rgb(42,48,60)] -top-[22px] left-[170px] h-0 pr-[30px]">
                블리스 스톤 루미의 색상은 어떻게 정해지나요?
                <span className="absolute text-lg leading-[23px] text-[rgb(42,48,60)] top-[10px] left-[1090px] h-5"></span>
              </strong>
              <div className="hidden relative mt-7 mb-2 mx-[170px] mr-[15px] pl-[23px]">
                {/* Answer content hidden by default */}
              </div>
            </li>
            {/* FAQ Item 6 */}
            <li className="w-[1320px] flex flex-col cursor-pointer border-b border-[rgb(234,236,240)] p-5">
              <span className="font-normal text-sm leading-[22px] tracking-[-0.5px] text-[rgb(92,98,114)] w-[120px] text-center">
                차량 지원 서비스
              </span>
              <strong className="font-bold text-lg relative leading-[23px] tracking-[-0.5px] text-[rgb(42,48,60)] -top-[22px] left-[170px] h-0 pr-[30px]">
                보호자 비동행 서비스가 무엇인가요?
                <span className="absolute text-lg leading-[23px] text-[rgb(42,48,60)] top-[10px] left-[1090px] h-5"></span>
              </strong>
              <div className="hidden relative mt-7 mb-2 mx-[170px] mr-[15px] pl-[23px]">
                {/* Answer content hidden by default */}
              </div>
            </li>
            {/* FAQ Item 7 */}
            <li className="w-[1320px] flex flex-col cursor-pointer border-b border-[rgb(234,236,240)] p-5">
              <span className="font-normal text-sm leading-[22px] tracking-[-0.5px] text-[rgb(92,98,114)] w-[120px] text-center">
                차량 지원 서비스
              </span>
              <strong className="font-bold text-lg relative leading-[23px] tracking-[-0.5px] text-[rgb(42,48,60)] -top-[22px] left-[170px] h-0 pr-[30px]">
                보호자 동행 서비스가 무엇인가요?
                <span className="absolute text-lg leading-[23px] text-[rgb(42,48,60)] top-[10px] left-[1090px] h-5"></span>
              </strong>
              <div className="hidden relative mt-7 mb-2 mx-[170px] mr-[15px] pl-[23px]">
                {/* Answer content hidden by default */}
              </div>
            </li>
            {/* FAQ Item 8 */}
            <li className="w-[1320px] flex flex-col cursor-pointer border-b border-[rgb(234,236,240)] p-5">
              <span className="font-normal text-sm leading-[22px] tracking-[-0.5px] text-[rgb(92,98,114)] w-[120px] text-center">
                기초 수습
              </span>
              <strong className="font-bold text-lg relative leading-[23px] tracking-[-0.5px] text-[rgb(42,48,60)] -top-[22px] left-[170px] h-0 pr-[30px]">
                사후 기초 수습은 어떻게 해야 할까요?
                <span className="absolute text-lg leading-[23px] text-[rgb(42,48,60)] top-[10px] left-[1090px] h-5"></span>
              </strong>
              <div className="hidden relative mt-7 mb-2 mx-[170px] mr-[15px] pl-[23px]">
                {/* Answer content hidden by default */}
              </div>
            </li>
            {/* FAQ Item 9 */}
            <li className="w-[1320px] flex flex-col cursor-pointer border-b border-[rgb(234,236,240)] p-5">
              <span className="font-normal text-sm leading-[22px] tracking-[-0.5px] text-[rgb(92,98,114)] w-[120px] text-center">
                디지털 추모
              </span>
              <strong className="font-bold text-lg relative leading-[23px] tracking-[-0.5px] text-[rgb(42,48,60)] -top-[22px] left-[170px] h-0 pr-[30px]">
                AVERE 이용하려면 어떻게 해야해요?
                <span className="absolute text-lg leading-[23px] text-[rgb(42,48,60)] top-[10px] left-[1090px] h-5"></span>
              </strong>
              <div className="hidden relative mt-7 mb-2 mx-[170px] mr-[15px] pl-[23px]">
                {/* Answer content hidden by default */}
              </div>
            </li>
            {/* FAQ Item 10 */}
            <li className="w-[1320px] flex flex-col cursor-pointer border-b border-[rgb(234,236,240)] p-5">
              <span className="font-normal text-sm leading-[22px] tracking-[-0.5px] text-[rgb(92,98,114)] w-[120px] text-center">
                디지털 추모
              </span>
              <strong className="font-bold text-lg relative leading-[23px] tracking-[-0.5px] text-[rgb(42,48,60)] -top-[22px] left-[170px] h-0 pr-[30px]">
                AVERE 가 뭐예요?
                <span className="absolute text-lg leading-[23px] text-[rgb(42,48,60)] top-[10px] left-[1090px] h-5"></span>
              </strong>
              <div className="hidden relative mt-7 mb-2 mx-[170px] mr-[15px] pl-[23px]">
                {/* Answer content hidden by default */}
              </div>
            </li>
          </ul>
          {/* Pagination */}
          <nav>
            <ul className="w-[1320px] flex flex-row justify-center items-center flex-wrap list-none mt-10 p-0 m-0">
              <li
                aria-disabled="true"
                aria-label="« Previous"
                className="w-6 mx-[5px]"
              >
                <span
                  aria-hidden="true"
                  className="font-normal inline-block w-6 h-6 text-center leading-6 text-[rgb(121,132,147)] text-[15px]"
                >
                  ‹
                </span>
              </li>
              <li aria-current="page" className="w-6 mx-[5px]">
                <span className="font-semibold inline-block w-6 h-6 text-center leading-6 text-[rgb(67,31,136)] text-[15px]">
                  1
                </span>
              </li>
              <li className="w-6 mx-[5px]">
                <a
                  href="http://fourpaws.co.kr/service/faq?page=2"
                  className="font-normal text-[rgb(121,132,147)] inline-block w-6 h-6 text-center leading-6 text-[15px] no-underline"
                >
                  2
                </a>
              </li>
              <li className="w-6 mx-[5px]">
                <a
                  href="http://fourpaws.co.kr/service/faq?page=3"
                  className="font-normal text-[rgb(121,132,147)] inline-block w-6 h-6 text-center leading-6 text-[15px] no-underline"
                >
                  3
                </a>
              </li>
              <li className="w-6 mx-[5px]">
                <a
                  href="http://fourpaws.co.kr/service/faq?page=2"
                  rel="next"
                  aria-label="Next »"
                  className="font-normal text-[rgb(121,132,147)] inline-block w-6 h-6 text-center leading-6 text-[15px] no-underline"
                >
                  ›
                </a>
              </li>
            </ul>
          </nav>
        </div>
      </div>
      {/* Bottom CTA Section (Hidden) */}
      <div className="hidden bg-[rgb(241,242,243)] text-center w-[calc(100%-48px)] leading-[17px] tracking-[-0.5px] text-[rgb(42,48,60)] py-[25px] mt-[31px] mx-auto">
        <h3 className="font-normal text-[12.5px] mb-[15px]">
          원하시는 정보가 없으신가요?
          <br />
          문의하기를 통해 궁금증을 해소해보세요.
        </h3>
        <a
          href="/service/quest/write"
          className="font-bold text-white w-auto inline-block h-[47px] leading-[47px] bg-[rgb(67,31,136)] text-[15px] rounded-[2px] px-[26px] no-underline"
        >
          문의하기
        </a>
      </div>
    </div>
  );
}
