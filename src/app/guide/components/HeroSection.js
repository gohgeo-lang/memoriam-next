export default function HeroSection() {
  return (
    <section className="relative h-screen overflow-hidden">
      <video
        autoPlay
        muted
        loop
        playsInline
        className="absolute top-1/2 left-1/2 min-w-full min-h-full -translate-x-1/2 -translate-y-1/2 object-cover"
      >
        <source
          src="https://cdn.pixabay.com/video/2017/03/08/8251-207598589_large.mp4"
          type="video/mp4"
        />
      </video>

      <div className="absolute inset-0 bg-black/40 z-0" />

      <div className="relative z-10 flex flex-col items-center justify-center h-full text-center text-[#edcbc2]">
        <h1 className="text-4xl md:text-6xl font-extrabold mb-4 ">
          안심가이드
        </h1>
        <p className="text-lg md:text-2xl text-[#d2ada3] mb-12 animate-fadeIn delay-200">
          처음 접하는 고객도 안심할 수 있는 <br />
          반려동물 장례 안내
        </p>
        {/* <img
          src="/image/dog-cat1.webp"
          alt="반려동물 이미지"
          className="mx-auto w-64 md:w-96 rounded-lg shadow-xl animate-fadeIn delay-400"
        /> */}
      </div>
    </section>
  );
}
