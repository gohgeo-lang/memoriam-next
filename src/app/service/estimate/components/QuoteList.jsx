import QuoteCard from "./QuoteCard";

export default function QuoteList({ quotes }) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
      {quotes.map((quote) => (
        <QuoteCard key={quote.id} quote={quote} />
      ))}
    </div>
  );
}
