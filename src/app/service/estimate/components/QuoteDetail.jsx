export default function QuoteDetail({ quote, onClose }) {
  if (!quote) return null;

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black/50">
      <div className="bg-white p-6 rounded-lg shadow-lg max-w-md w-full">
        <h2 className="text-xl font-bold">{quote.name}</h2>
        <p className="mt-2">가격: {quote.price.toLocaleString()}원</p>
        <p>평점: ⭐ {quote.rating}</p>
        <button
          onClick={onClose}
          className="mt-4 px-4 py-2 bg-red-500 text-white rounded"
        >
          닫기
        </button>
      </div>
    </div>
  );
}
