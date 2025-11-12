"use client";

import Section from "@/components/Section";
import Image from "next/image";
import Link from "next/link";

export default function Home() {
  return (
    <>
      <section className="relative min-h-screen text-center overflow-hidden px-5 flex flex-col justify-center items-center py-20">
        <video
          autoPlay
          loop
          muted
          playsInline
          src="https://cdn.pixabay.com/video/2021/05/03/72920-545276992_large.mp4"
          className="absolute top-0 left-0 w-full h-full object-cover z-0"
        >
          Your browser does not support the video tag.
        </video>

        <div className="absolute top-0 left-0 w-full h-full bg-black opacity-70 z-10"></div>

        <div className="relative z-20 max-w-2xl mx-auto">
          <h1 className="text-4xl font-bold text-white mb-4">
            소중한{" "}
            <span className="text-white [text-shadow:0_0_2px_rgba(123,84,73,0.9)]">
              기억
            </span>
            을 가장 선명히 조각합니다
          </h1>

          <blockquote className="max-w-lg mx-auto border-t border-gray-400 border-opacity-50 pt-6 [text-shadow:0_1px_2px_rgba(0,0,0,0.8)]">
            <p className="text-xl text-gray-200 italic leading-relaxed">
              "나에게 녀석들은 반려가 아니라 여행자에 가깝다.
              <br />
              긴 여행을 하다보면
              <br />
              짧은 구간들을 함께 하는 동행이 생긴다.
              <br />
              며칠 동안 함께 움직이다가 어떤 이는 먼저 떠나고,
              <br />
              어떤 이는 방향이 달라 다른 길로 간다.
              <br />
              ㆍㆍㆍ
              <br />
              인간이든 동물이든 그렇게 모두 여행자라고 생각하면
              <br />
              떠나보내는 마음이 덜 괴롭다"
            </p>
            <footer className="mt-4 text-base text-gray-300 not-italic">
              - 김영하, &lt;여행의 이유&gt; 中
            </footer>
          </blockquote>
        </div>
      </section>

      <section className="relative min-h-screen text-center overflow-hidden px-5 flex flex-col justify-center items-center py-20">
        <video
          autoPlay
          loop
          muted
          playsInline
          src="https://cdn.pixabay.com/video/2023/03/27/156357-812591855_large.mp4"
          className="absolute top-0 left-0 w-full h-full object-cover z-0"
        >
          Your browser does not support the video tag.
        </video>

        <div className="absolute top-0 left-0 w-full h-full bg-black opacity-80 z-10"></div>
        <div className="relative z-20 max-w-2xl mx-auto">
          <h2 className="text-3xl font-bold text-white mb-6 [text-shadow:0_1px_2px_rgba(0,0,0,0.8)]">
            당신의 소중한 기억은 누군가의 따뜻한 위로로
          </h2>
          <p className="text-xl text-gray-200 mx-auto mb-8 [text-shadow:0_1px_2px_rgba(0,0,0,0.8)]">
            함께 이 세계를 여행했으나 먼저 떠난 아이들의 이야기
            <br />
            메모리얼은 여정의 기억을 엮는 위로와 공감의 공간입니다.
          </p>
          <Link href="/service/memoriam">
            <button className="bg-white text-[#7b5449] font-semibold px-8 py-3 rounded-xl active:bg-gray-200 active:scale-[0.98] transition-all hover:bg-[#7b5449] hover:text-white">
              메모리얼 둘러보기
            </button>
          </Link>
        </div>
      </section>

      <Section className="bg-gray-50 text-center px-5">
        <h2 className="text-3xl font-bold text-center text-[#7b5449] mb-10">
          메모리엄이 전하는 가치
        </h2>
        <div className="flex flex-col md:flex-row justify-center gap-6 max-w-4xl mx-auto">
          <div className="flex-1 bg-white rounded-lg p-8 shadow-sm">
            <h3 className="text-[#7b5449] font-semibold text-xl mb-3">기억</h3>
            <p className="text-gray-600">남겨진 이들의 이야기를 이어갑니다.</p>
          </div>
          <div className="flex-1 bg-white rounded-lg p-8 shadow-sm">
            <h3 className="text-[#7b5449] font-semibold text-xl mb-3">위로</h3>
            <p className="text-gray-600">
              아이와의 여행은 이야기로써 함께 세계를 유영합니다.
            </p>
          </div>
          <div className="flex-1 bg-white rounded-lg p-8 shadow-sm">
            <h3 className="text-[#7b5449] font-semibold text-xl mb-3">동행</h3>
            <p className="text-gray-600">
              이야기의 마지막 줄을 함께 써 내려갑니다.
            </p>
          </div>
        </div>
      </Section>

      <Section className="bg-white text-center px-5">
        <h2 className="text-3xl font-bold text-center text-[#7b5449] mb-10">
          메모리엄이 제공하는 서비스
        </h2>
        {/* === 수정된 부분: Link 순서 변경 === */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-4xl mx-auto">
          {/* 서비스 카드 1: 이용 가이드 (순서 변경) */}
          <Link
            href="/guide"
            className="block p-8 bg-gray-50 rounded-lg shadow-md hover:shadow-lg transition-shadow"
          >
            <h3 className="text-2xl font-semibold text-[#7b5449] mb-4">
              안심 가이드
            </h3>
            <p className="text-gray-600 text-lg">
              메모리엄 이용 방법과
              <br />
              장례 절차를 안내해 드립니다.
            </p>
          </Link>

          <Link
            href="/service/memoriam"
            className="block p-8 bg-gray-50 rounded-lg shadow-md hover:shadow-lg transition-shadow"
          >
            <h3 className="text-2xl font-semibold text-[#7b5449] mb-4">
              메모리얼
            </h3>
            <p className="text-gray-600 text-lg">
              언제 어디서나 아이를 추억하고
              <br />
              위로의 마음을 나눌 수 있는 추모 공간입니다.
            </p>
          </Link>

          <Link
            href="/service/estimate"
            className="block p-8 bg-gray-50 rounded-lg shadow-md hover:shadow-lg transition-shadow"
          >
            <h3 className="text-2xl font-semibold text-[#7b5449] mb-4">
              장례 견적 비교
            </h3>
            <p className="text-gray-600 text-lg">
              믿을 수 있는 장례 업체를
              <br />
              투명하게 비교하고 선택할 수 있습니다.
            </p>
          </Link>

          <Link
            href="/service/photo"
            className="block p-8 bg-gray-50 rounded-lg shadow-md hover:shadow-lg transition-shadow"
          >
            <h3 className="text-2xl font-semibold text-[#7b5449] mb-4">
              AI 영정 사진
            </h3>
            <p className="text-gray-600 text-lg">
              아이의 가장 예쁜 모습을
              <br />
              오래도록 선명하게 간직하세요.
            </p>
          </Link>
        </div>
      </Section>
    </>
  );
}
