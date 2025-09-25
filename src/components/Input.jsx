"use client";

export default function Input({ label, type = "text", ...props }) {
  return (
    <div className="flex flex-col gap-1 text-left">
      {label && (
        <label className="text-sm font-medium text-[#7b5449]">{label}</label>
      )}
      <input
        type={type}
        {...props}
        className="px-4 py-2 border border-gray-300 rounded-md text-base focus:outline-none focus:border-[#7b5449]"
      />
    </div>
  );
}
