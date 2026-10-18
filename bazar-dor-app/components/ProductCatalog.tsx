"use client";

import { useState } from "react";
import ProductSearch from "./ProductSearch";

type Product = {
  id: number;
  nameBn: string;
  category: string;
  categoryNameBn: string;
  categoryIcon: string;
  unit: string;
  today: number;
  yesterday: number;
  change: {
    dir: "up" | "down" | "same";
    pct: number;
  };
};

type ProductCatalogProps = {
  products: Product[];
};

export default function ProductCatalog({
  products,
}: ProductCatalogProps) {
  const [searchText, setSearchText] = useState("");

  const filteredProducts = products.filter((product) => {
    const search = searchText.trim().toLowerCase();

    return (
      product.nameBn.toLowerCase().includes(search) ||
      product.categoryNameBn.toLowerCase().includes(search) ||
      product.category.toLowerCase().includes(search)
    );
  });

  return (
    <div>
      <div className="mb-10">
        <ProductSearch onSearch={setSearchText} />
      </div>

      <div className="mb-6 flex items-center justify-between">
        <p className="font-semibold text-slate-700">
          {searchText.trim()
            ? `"${searchText}" অনুসন্ধানের ফলাফল`
            : "সকল পণ্য"}
        </p>

        <p className="text-sm text-slate-500">
          পাওয়া গেছে {filteredProducts.length}টি পণ্য
        </p>
      </div>

      {filteredProducts.length > 0 ? (
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {filteredProducts.map((product) => (
            <article
              key={product.id}
              className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm transition hover:-translate-y-1 hover:shadow-lg"
            >
              <div className="flex h-14 w-14 items-center justify-center rounded-xl bg-green-50 text-3xl">
                {product.categoryIcon || "🛒"}
              </div>

              <p className="mt-5 text-sm text-slate-500">
                {product.categoryNameBn}
              </p>

              <h3 className="mt-2 text-xl font-bold">
                {product.nameBn}
              </h3>

              <p className="mt-3 text-2xl font-extrabold text-green-700">
                ৳{product.today} / {product.unit}
              </p>

              <a
                href={`/products/${product.id}`}
                className="mt-5 block rounded-xl bg-green-600 px-4 py-3 text-center font-semibold text-white transition hover:bg-green-700"
              >
                বিস্তারিত দেখুন →
              </a>

              <p className="mt-3 text-sm text-slate-500">
                ক্যাটাগরি: {product.category}
              </p>

              <div className="mt-5 border-t border-slate-100 pt-4">
                <p className="text-sm text-slate-500">
                  গতকালের দাম
                </p>

                <p className="mt-1 font-semibold text-slate-700">
                  ৳{product.yesterday}
                </p>
              </div>

              <div className="mt-4">
                <span
                  className={`rounded-lg px-3 py-2 text-sm font-bold ${
                    product.change.dir === "up"
                      ? "bg-red-50 text-red-600"
                      : product.change.dir === "down"
                        ? "bg-green-50 text-green-700"
                        : "bg-slate-100 text-slate-600"
                  }`}
                >
                  {product.change.dir === "up"
                    ? "+"
                    : product.change.dir === "down"
                      ? "−"
                      : ""}
                  {Math.abs(product.change.pct)}%
                </span>
              </div>
            </article>
          ))}
        </div>
      ) : (
        <div className="rounded-2xl border border-slate-200 bg-white px-6 py-12 text-center">
          <div className="text-5xl">🔎</div>

          <h3 className="mt-4 text-xl font-bold text-slate-800">
            কোনো পণ্য পাওয়া যায়নি!
          </h3>

          <p className="mt-2 text-slate-500">
            অন্য কোনো পণ্যের নাম লিখে আবার চেষ্টা করো।
          </p>

          <button
            type="button"
            onClick={() => setSearchText("")}
            className="mt-5 rounded-xl bg-green-600 px-6 py-3 font-semibold text-white hover:bg-green-700"
          >
            সব পণ্য দেখুন
          </button>
        </div>
      )}
    </div>
  );
}