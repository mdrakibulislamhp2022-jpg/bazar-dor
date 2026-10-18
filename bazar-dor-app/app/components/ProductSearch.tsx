"use client";

import { useState } from "react";

type ProductSearchProps = {
  onSearch: (value: string) => void;
};

export default function ProductSearch({
  onSearch,
}: ProductSearchProps) {
  const [searchText, setSearchText] = useState("");

  function handleSearch(value: string) {
    setSearchText(value);
    onSearch(value);
  }

  return (
    <div className="mx-auto w-full max-w-2xl">
      <label
        htmlFor="product-search"
        className="mb-3 block text-lg font-bold text-slate-800"
      >
        আপনার প্রয়োজনীয় পণ্য খুঁজুন
      </label>

      <div className="flex items-center gap-3 rounded-2xl border border-slate-200 bg-white p-2 shadow-sm focus-within:border-green-500 focus-within:ring-2 focus-within:ring-green-100">
        <span className="pl-3 text-2xl" aria-hidden="true">
          🔍
        </span>

        <input
          id="product-search"
          type="search"
          value={searchText}
          onChange={(event) => handleSearch(event.target.value)}
          placeholder="যেমন: চাল, মাছ, ডাল..."
          className="min-w-0 flex-1 bg-transparent py-3 text-slate-800 outline-none placeholder:text-slate-400"
        />

        {searchText && (
          <button
            type="button"
            onClick={() => handleSearch("")}
            className="rounded-xl px-4 py-3 font-semibold text-green-700 hover:bg-green-50"
          >
            মুছুন
          </button>
        )}
      </div>

      <p className="mt-2 text-sm text-slate-500">
        পণ্যের নাম লিখলেই খোঁজা শুরু হবে।
      </p>
    </div>
  );
}