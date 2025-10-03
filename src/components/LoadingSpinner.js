export default function LoadingSpinner({ text = "로딩 중..." }) {
  return (
    <div className="flex h-screen items-center justify-center">
      <div className="flex flex-col items-center">
        <div className="animate-spin rounded-full h-10 w-10 border-t-2 border-b-2 border-blue-500"></div>
        <p className="mt-4 text-gray-600">{text}</p>
      </div>
    </div>
  );
}
