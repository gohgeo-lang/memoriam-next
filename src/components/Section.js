"use client";

export default function Section({ title, children, className = "" }) {
  return (
    <section
      className={`px-5 py-16 max-w-5xl mx-auto text-center ${className}`}
    >
      {title && (
        <h2 className="text-2xl font-semibold text-gray-900 mb-8">{title}</h2>
      )}
      {children}
    </section>
  );
}
