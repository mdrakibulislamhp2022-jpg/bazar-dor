"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
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
  lastWeek: number;
  lastMonth: number;
  change: {
    dir: "up" | "down" | "same";
    pct: number;
  };
};

type ProductCatalogProps = {
  products: Product[];
};

type SortOption = "default" | "price-low" | "price-high" | "name";

const formatPrice = (price: number) =>
  `৳${new Intl.NumberFormat("bn-BD").format(price)}`;

export default function ProductCatalog({
  products,
}: ProductCatalogProps) {
  const [searchText, setSearchText] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [sortBy, setSortBy] = useState<SortOption>("default");

  const safeProducts = Array.isArray(products) ? products : [];

  const categories = useMemo(
    () =>
      Array.from(
        new Set(
          safeProducts
            .map((product) => product.categoryNameBn)
            .filter(Boolean),
        ),
      ),
    [safeProducts],
  );

  const filteredProducts = useMemo(() => {
    const search = searchText.trim().toLocaleLowerCase("bn");

    const filtered = safeProducts.filter((product) => {
      const name = product.nameBn ?? "";
      const categoryName = product.categoryNameBn ?? "";
      const category = product.category ?? "";

      const matchesSearch =
        name.toLocaleLowerCase("bn").includes(search) ||
        categoryName.toLocaleLowerCase("bn").includes(search) ||
        category.toLocaleLowerCase("bn").includes(search);

      const matchesCategory =
        selectedCategory === "all" ||
        categoryName === selectedCategory;

      return matchesSearch && matchesCategory;
    });

    switch (sortBy) {
      case "price-low":
        return [...filtered].sort(
          (a, b) => a.today - b.today,
        );

      case "price-high":
        return [...filtered].sort(
          (a, b) => b.today - a.today,
        );

      case "name":
        return [...filtered].sort((a, b) =>
          (a.nameBn ?? "").localeCompare(b.nameBn ?? "", "bn"),
        );

      default:
        return filtered;
    }
  }, [safeProducts, searchText, selectedCategory, sortBy]);

  function resetFilters() {
    setSearchText("");
    setSelectedCategory("all");
    setSortBy("default");
  }

  return (
    <section className="w-full">
      {/* Search */}
      <div className="mb-8">
        <ProductSearch onSearch={setSearchText} />
      </div>

      {/* Category Filter */}
      <div className="mb-8">
        <h2 className="mb-4 text-lg font-bold text-slate-800">
          ক্যাটাগরি অনুযায়ী পণ্য
        </h2>

        <div className="flex flex-wrap gap-3">
          <button
            type="button"
            onClick={() => setSelectedCategory("all")}
            aria-pressed={selectedCategory === "all"}
            className={`rounded-full px-5 py-2 font-semibold transition ${
              selectedCategory === "all"
                ? "bg-green-600 text-white shadow-sm"
                : "border border-slate-200 bg-white text-slate-700 hover:bg-green-50"
            }`}
          >
            🛒 সব পণ্য
          </button>

          {categories.map((category) => (
            <button
              key={category}
              type="button"
              onClick={() => setSelectedCategory(category)}
              aria-pressed={selectedCategory === category}
              className={`rounded-full px-5 py-2 font-semibold transition ${
                selectedCategory === category
                  ? "bg-green-600 text-white shadow-sm"
                  : "border border-slate-200 bg-white text-slate-700 hover:bg-green-50"
              }`}
            >
              {category}
            </button>
          ))}
        </div>
      </div>

      {/* Product Count and Sorting */}
      <div className="mb-6 flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
        <div>
          <h2 className="text-xl font-bold text-slate-800">
            {selectedCategory === "all"
              ? "সকল পণ্য"
              : `${selectedCategory} ক্যাটাগরির পণ্য`}
          </h2>

          <p className="mt-1 text-sm text-slate-500">
            পাওয়া গেছে {filteredProducts.length}টি পণ্য
          </p>
        </div>

        <div className="flex items-center gap-3">
          <label
            htmlFor="product-sort"
            className="shrink-0 text-sm font-medium text-slate-600"
          >
            সাজান:
          </label>

          <select
            id="product-sort"
            value={sortBy}
            onChange={(event) =>
              setSortBy(event.target.value as SortOption)
            }
            className="w-full rounded-xl border border-slate-200 bg-white px-3 py-2 text-sm text-slate-700 outline-none focus:border-green-500 focus:ring-2 focus:ring-green-100 sm:w-auto"
          >
            <option value="default">ডিফল্ট</option>
            <option value="price-low">দাম: কম থেকে বেশি</option>
            <option value="price-high">দাম: বেশি থেকে কম</option>
            <option value="name">নাম অনুযায়ী</option>
          </select>
        </div>
      </div>

      {/* Product Grid */}
      {filteredProducts.length > 0 ? (
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {filteredProducts.map((product) => {
            const today = Number(product.today) || 0;
            const yesterday = Number(product.yesterday) || 0;
            const lastWeek = Number(product.lastWeek) || 0;
            const lastMonth = Number(product.lastMonth) || 0;

            const priceDifference = today - yesterday;

            const priceDirection =
              priceDifference > 0
                ? "up"
                : priceDifference < 0
                  ? "down"
                  : "same";

            const apiChange = product.change ?? {
              dir: "same" as const,
              pct: 0,
            };

            return (
              <article
                key={product.id}
                className="flex h-full flex-col overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm transition duration-300 hover:-translate-y-1 hover:shadow-lg"
              >
                {/* Product Header */}
                <div className="bg-gradient-to-r from-green-50 to-emerald-50 p-6">
                  <div className="flex items-center justify-between gap-3">
                    <span
                      className="flex h-14 w-14 shrink-0 items-center justify-center rounded-xl bg-white text-3xl shadow-sm"
                      aria-hidden="true"
                    >
                      {product.categoryIcon || "🛒"}
                    </span>

                    <span className="rounded-full bg-white px-3 py-1 text-xs font-semibold text-slate-600">
                      {product.categoryNameBn || "অন্যান্য"}
                    </span>
                  </div>

                  <h3 className="mt-4 text-xl font-bold text-slate-800">
                    {product.nameBn || "নাম পাওয়া যায়নি"}
                  </h3>

                  <p className="mt-1 text-sm text-slate-500">
                    প্রতি {product.unit || "ইউনিট"}
                  </p>
                </div>

                {/* Product Information */}
                <div className="flex flex-1 flex-col p-6">
                  {/* Today's Price */}
                  <p className="text-sm font-medium text-slate-500">
                    আজকের দাম
                  </p>

                  <div className="mt-2 flex flex-wrap items-center gap-3">
                    <p className="text-3xl font-extrabold text-green-700">
                      {formatPrice(today)}
                    </p>

                    <span
                      className={`rounded-full px-3 py-1 text-xs font-bold ${
                        priceDirection === "up"
                          ? "bg-red-50 text-red-600"
                          : priceDirection === "down"
                            ? "bg-green-50 text-green-700"
                            : "bg-slate-100 text-slate-600"
                      }`}
                    >
                      {priceDirection === "up"
                        ? "▲ দাম বেড়েছে"
                        : priceDirection === "down"
                          ? "▼ দাম কমেছে"
                          : "— অপরিবর্তিত"}
                    </span>
                  </div>

                  <p className="mt-2 text-sm text-slate-600">
                    গতকালের তুলনায়{" "}
                    <strong
                      className={
                        priceDirection === "up"
                          ? "text-red-600"
                          : priceDirection === "down"
                            ? "text-green-700"
                            : "text-slate-600"
                      }
                    >
                      {priceDifference > 0 ? "+" : ""}
                      {formatPrice(priceDifference)}
                    </strong>
                  </p>

                  {/* Price History */}
                  <div className="mt-6 space-y-4 border-t border-slate-100 pt-5">
                    <div className="flex items-center justify-between gap-3">
                      <span className="text-sm text-slate-500">
                        গতকালের দাম
                      </span>

                      <span className="font-bold text-slate-800">
                        {formatPrice(yesterday)}
                      </span>
                    </div>

                    <div className="flex items-center justify-between gap-3">
                      <span className="text-sm text-slate-500">
                        গত সপ্তাহের দাম
                      </span>

                      <span className="font-bold text-slate-800">
                        {formatPrice(lastWeek)}
                      </span>
                    </div>

                    <div className="flex items-center justify-between gap-3">
                      <span className="text-sm text-slate-500">
                        গত মাসের দাম
                      </span>

                      <span className="font-bold text-slate-800">
                        {formatPrice(lastMonth)}
                      </span>
                    </div>
                  </div>

                  {/* API Price Change */}
                  <div className="mt-5 rounded-xl bg-slate-50 p-4">
                    <p className="text-sm text-slate-500">
                      API অনুযায়ী দামের পরিবর্তন
                    </p>

                    <p
                      className={`mt-1 text-lg font-extrabold ${
                        apiChange.dir === "up"
                          ? "text-red-600"
                          : apiChange.dir === "down"
                            ? "text-green-700"
                            : "text-slate-600"
                      }`}
                    >
                      {apiChange.dir === "up"
                        ? "▲ +"
                        : apiChange.dir === "down"
                          ? "▼ −"
                          : "— "}
                      {Math.abs(Number(apiChange.pct) || 0)}%
                    </p>
                  </div>

                  {/* Product Details */}
                  <Link
                    href={`/products/${product.id}`}
                    className="mt-auto mt-5 block rounded-xl bg-green-600 px-4 py-3 text-center font-bold text-white transition hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2"
                  >
                    বিস্তারিত দেখুন →
                  </Link>
                </div>
              </article>
            );
          })}
        </div>
      ) : (
        /* Empty State */
        <div className="rounded-2xl border border-slate-200 bg-white px-6 py-12 text-center">
          <div className="text-5xl" aria-hidden="true">
            🔎
          </div>

          <h3 className="mt-4 text-xl font-bold text-slate-800">
            কোনো পণ্য পাওয়া যায়নি!
          </h3>

          <p className="mt-2 text-slate-500">
            অন্য কোনো পণ্যের নাম লিখে অথবা অন্য ক্যাটাগরি নির্বাচন করে চেষ্টা করুন।
          </p>

          <button
            type="button"
            onClick={resetFilters}
            className="mt-5 rounded-xl bg-green-600 px-6 py-3 font-semibold text-white transition hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2"
          >
            সব পণ্য দেখুন
          </button>
        </div>
      )}
    </section>
  );
}