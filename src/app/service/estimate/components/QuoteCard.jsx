export default function QuoteCard({ quote }) {
  return (
    <div className="border p-4 rounded-lg shadow hover:shadow-md transition">
      <h2 className="text-lg font-semibold">{quote.name}</h2>
      <p className="text-gray-600">가격: {quote.price.toLocaleString()}원</p>
      <p className="text-yellow-500">평점: ⭐ {quote.rating}</p>
      <button className="mt-2 px-3 py-1 bg-green-500 text-white rounded">
        비교하기
      </button>
    </div>
  );
}
