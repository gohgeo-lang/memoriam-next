export default function Reservation({ isOpen, onClose }) {
  if (!isOpen) return null;

  return (
    <section className="max-w-4xl mt-2 mx-auto px-10 py-5 bg-gray-100 rounded-2xl min-h-screen flex items-center justify-center">
      <div className="bg-white rounded-2xl shadow-2xl p-10 w-full">
        <h1 className="text-3xl font-bold text-center text-blue-700 mb-10">
          🐾 반려동물 장례 예약 및 상담
        </h1>

        <form className="space-y-8">
          {/* 보호자 정보 */}
          <div className="grid md:grid-cols-2 gap-6 text-black">
            <div>
              <label className="block text-gray-700 font-medium mb-2">
                보호자 성함
              </label>
              <input
                type="text"
                className="w-full border border-gray-300 rounded-md px-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="이름을 입력해주세요"
              />
            </div>

            <div>
              <label className="block text-gray-700 font-medium mb-2">
                연락처
              </label>
              <input
                type="tel"
                className="w-full border border-gray-300 rounded-md px-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="010-0000-0000"
              />
            </div>
          </div>

          {/* 반려동물 정보 */}
          <div>
            <label className="block text-gray-700 font-medium mb-2">
              반려동물 정보
            </label>
            <div className="grid md:grid-cols-3 gap-4 text-black">
              <select className="border border-gray-300 rounded-md px-3 py-3 focus:outline-none focus:ring-2 focus:ring-blue-500">
                <option>동물 종류</option>
                <option>강아지</option>
                <option>고양이</option>
                <option>기타</option>
              </select>
              <input
                type="text"
                className="border border-gray-300 rounded-md px-3 py-3 focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="이름"
              />
              <input
                type="text"
                className="border border-gray-300 rounded-md px-3 py-3 focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="나이"
              />
            </div>
          </div>

          {/* 상담 서비스 */}
          <div>
            <label className="block text-gray-700 font-medium mb-2">
              상담 희망 서비스
            </label>
            <div className="grid md:grid-cols-2 gap-3">
              {["장례 상담", "화장 서비스", "안치 서비스", "추모 상담"].map(
                (service) => (
                  <label
                    key={service}
                    className="flex items-center bg-gray-100 rounded-lg px-4 py-2 hover:bg-gray-200 cursor-pointer"
                  >
                    <input type="checkbox" className="mr-3 accent-blue-600" />
                    <span className="text-gray-800">{service}</span>
                  </label>
                )
              )}
            </div>
          </div>

          {/* 추가 요청사항 */}
          <div>
            <label className="block text-gray-700 font-medium mb-2">
              추가 요청사항
            </label>
            <textarea
              className="w-full border border-gray-300 rounded-md px-4 py-3 h-28 focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="특별한 요청사항을 알려주세요"
            ></textarea>
          </div>

          {/* 버튼 */}
          <div className="text-center">
            <button
              type="button"
              onClick={onClose}
              className="bg-blue-600 text-white px-10 py-3 rounded-md hover:bg-blue-700 transition-colors font-semibold"
            >
              상담 예약하기
            </button>
          </div>
        </form>
      </div>
    </section>
  );
}
