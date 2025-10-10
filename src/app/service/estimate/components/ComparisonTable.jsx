export default function ComparisonTable({ selected }) {
  return (
    <div className="overflow-x-auto border rounded-lg mt-6">
      <table className="min-w-full border-collapse">
        <thead>
          <tr className="bg-gray-100">
            <th className="border p-2">업체명</th>
            <th className="border p-2">가격</th>
            <th className="border p-2">평점</th>
          </tr>
        </thead>
        <tbody>
          {selected.map((quote) => (
            <tr key={quote.id}>
              <td className="border p-2">{quote.name}</td>
              <td className="border p-2">{quote.price.toLocaleString()}원</td>
              <td className="border p-2">⭐ {quote.rating}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
