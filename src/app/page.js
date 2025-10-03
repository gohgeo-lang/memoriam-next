"use client";

import Input from "@/components/Input";
import Section from "@/components/Section";
import Image from "next/image";
import Link from "next/link";

export default function Home() {
  return (
    <div>
      <Section className="min-h-[80vh] flex flex-col justify-center items-center bg-white text-center px-5">
        <h1 className="text-4xl font-bold text-gray-900 mb-4">
          소중한 기억을 가장 선명히 조각합니다.
        </h1>
        <p className="text-lg text-gray-700 max-w-xl">
          우리아이를 위한 고요하고 따뜻한 추모 공간, 메모리엄
        </p>
      </Section>

      <Section
        className="bg-gray-50 text-center px-5 py-16"
        title="메모리엄이 전하는 가치"
      >
        <div className="flex flex-col gap-6 max-w-3xl mx-auto">
          <div className="bg-white rounded-lg p-6 shadow-sm">
            <h3 className="text-[#7b5449] font-semibold text-lg">기억</h3>
            <p className="text-gray-600">남겨진 이들의 이야기를 이어갑니다.</p>
          </div>
          <div className="bg-white rounded-lg p-6 shadow-sm">
            <h3 className="text-[#7b5449] font-semibold text-lg">위로</h3>
            <p className="text-gray-600">
              슬픔을 함께 나누고, 고요히 곁에 머뭅니다.
            </p>
          </div>
          <div className="bg-white rounded-lg p-6 shadow-sm">
            <h3 className="text-[#7b5449] font-semibold text-lg">동행</h3>
            <p className="text-gray-600">
              사람과 반려동물 모두를 위한 추모 서비스.
            </p>
          </div>
        </div>
      </Section>

      <Section className="text-center px-5 py-16" title="추모의 공간 미리보기">
        <div className="flex justify-center flex-wrap gap-6">
          <div className="w-64 bg-white rounded-lg shadow-sm p-4">
            <Image
              src="/image/pet.jpg"
              alt="추모 사진"
              width={250}
              height={250}
              className="rounded-lg mb-3"
            />
            <h3 className="text-gray-900 font-semibold">댕청이</h3>
            <h5 className="text-gray-600 text-sm">(2010 ~ 2025)</h5>
            <p className="text-gray-500 text-sm">“내새깽이”</p>
          </div>
        </div>
        <Link href="/service/photo">
          {/** 메모리얼페이지 만들면 변경할 것 **/}
          <button className="mt-6 bg-[#7b5449] text-white px-6 py-3 rounded-xl active:bg-[#5a3e36] active:text-stone-500 active:scale-[0.98]">
            더 많은 이야기 보기
          </button>
        </Link>
      </Section>

      <Section
        className="bg-gray-100 text-center px-5 py-16"
        title="필요한 순간, 곁에 있겠습니다."
      >
        <form className="flex flex-col gap-3 max-w-sm mx-auto">
          <Input label="이름" placeholder="이름을 입력하세요" />
          <Input label="연락처" type="tel" placeholder="010-1234-5678" />
          <button
            type="submit"
            className="bg-[#7b5449] text-white px-6 py-3 rounded-xl active:bg-[#5a3e36] active:text-stone-500 active:scale-[0.98]"
          >
            상담 신청
          </button>
        </form>
      </Section>
    </div>
  );
}
