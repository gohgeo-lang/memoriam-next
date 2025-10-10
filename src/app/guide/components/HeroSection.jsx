export default function HeroSection() {
  return (
    <section className="relative bg-gradient-to-b from-yellow-950/70 to-orange-950/10 text-white py-24 px-6">
      <div className="max-w-5xl mx-auto text-center">
        <h1 className="text-4xl md:text-6xl font-extrabold mb-4 ">
          안심가이드
        </h1>
        <p className="text-lg md:text-2xl text-blue-200 mb-12 animate-fadeIn delay-200">
          처음 접하는 고객도 안심할 수 있는 <br />
          반려동물 장례 안내
        </p>
        <img
          src="/image/dog-cat.webp"
          alt="반려동물 이미지"
          className="mx-auto w-64 md:w-96 rounded-lg shadow-xl animate-fadeIn delay-400"
        />
      </div>
    </section>
  );
}
