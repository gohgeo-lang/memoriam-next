export default function FrameCard({ children }) {
  return (
    <div className="max-w-sm mx-auto bg-white border-8 border-[#765f58] rounded-2xl shadow-lg p-4">
      <div className="border-4 border-[#765f58] rounded-xl p-6 bg-white">
        <div>{children}</div>
      </div>
    </div>
  );
}
