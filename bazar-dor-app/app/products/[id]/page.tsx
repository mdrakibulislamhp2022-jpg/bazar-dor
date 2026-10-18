import { Suspense } from "react";
import Link from "next/link";

type Market = {
  market: string;
  division: string;
  min: number;
  max: number;
};

type Product = {
  id: number;
  slug?: string;
  nameBn: string;
  category?: string;
  categoryNameBn: string;
  categoryIcon: string;
  unit: string;
  image?: string;
  today: number;
  yesterday: number;
  lastWeek: number;
  lastMonth: number;
  change: {
    dir: "up" | "down" | "same";
    pct: number;
  };
  markets?: Market[];
};

async function getProduct(id: string): Promise<Product | null> {
  try {
    const response = await fetch(
      `https://openapi.programming-hero.com/api/bazardor/products/${encodeURIComponent(id)}`,
      {
        cache: "no-store",
      }
    );

    if (!response.ok) {
      return null;
    }

    const result = await response.json();

    // API response-এর বিভিন্ন structure সামলানো
    const product =
      result?.data?.product ??
      result?.data ??
      result?.product ??
      result;

    if (
      !product ||
      typeof product !== "object" ||
      !("id" in product) ||
      !("nameBn" in product)
    ) {
      return null;
    }

    return product as Product;
  } catch (error) {
    console.error("Product API error:", error);
    return null;
  }
}

function formatPrice(price: number | undefined): string {
  if (typeof price !== "number" || !Number.isFinite(price)) {
    return "তথ্য নেই";
  }

  return `৳${price.toLocaleString("en-BD")}`;
}

// Main Page: API থেকে ডেটা লোড করার কাজ Suspense-এর বাইরে হবে না।
export default function ProductDetails({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  return (
    <Suspense
      fallback={
        <main className="flex min-h-screen items-center justify-center bg-slate-50 px-6">
          <div className="text-center">
            <div className="mx-auto h-12 w-12 animate-spin rounded-full border-4 border-green-200 border-t-green-700" />

            <p className="mt-5 text-lg font-semibold text-green-700">
              পণ্যের তথ্য লোড হচ্ছে...
            </p>

            <p className="mt-2 text-sm text-slate-500">
              অনুগ্রহ করে অপেক্ষা করুন।
            </p>
          </div>
        </main>
      }
    >
      <ProductDetailsContent params={params} />
    </Suspense>
  );
}

// API থেকে ডেটা আনার কাজ এই Suspense-wrapped component-এর মধ্যে।
async function ProductDetailsContent({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const product = await getProduct(id);

  if (!product) {
    return (
      <main className="flex min-h-screen items-center justify-center bg-slate-50 px-6">
        <div className="w-full max-w-lg rounded-3xl border border-slate-200 bg-white p-8 text-center shadow-sm">
          <div className="text-6xl">🔎</div>

          <h1 className="mt-5 text-2xl font-extrabold text-slate-900">
            পণ্যের তথ্য পাওয়া যায়নি!
          </h1>

          <p className="mt-3 leading-7 text-slate-500">
            পণ্যটি পাওয়া যাচ্ছে না অথবা API থেকে তথ্য লোড করা সম্ভব হয়নি।
          </p>

          <Link
            href="/"
            className="mt-6 inline-block rounded-xl bg-green-700 px-6 py-3 font-bold text-white transition hover:bg-green-800"
          >
            ← হোমপেজে ফিরে যান
          </Link>
        </div>
      </main>
    );
  }

  const priceDifference = product.today - product.yesterday;

  const priceDirection =
    priceDifference > 0
      ? "up"
      : priceDifference < 0
        ? "down"
        : "same";

  const priceHistory = [
    {
      title: "গতকালের দাম",
      price: product.yesterday,
      icon: "🗓️",
    },
    {
      title: "গত সপ্তাহের দাম",
      price: product.lastWeek,
      icon: "📅",
    },
    {
      title: "গত মাসের দাম",
      price: product.lastMonth,
      icon: "📊",
    },
  ];

  return (
    <main className="min-h-screen bg-slate-50 text-slate-900">
      {/* Navbar */}
      <header className="border-b border-slate-200 bg-white">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-6 py-5">
          <Link href="/" className="text-2xl font-extrabold text-green-700">
            Bazar<span className="text-orange-500">Dor</span>
          </Link>

          <Link
            href="/"
            className="rounded-xl border border-slate-200 px-4 py-2 font-semibold transition hover:bg-green-50"
          >
            ← ফিরে যান
          </Link>
        </div>
      </header>

      <div className="mx-auto max-w-7xl px-6 py-10 md:py-14">
        {/* Breadcrumb */}
        <div className="mb-8 flex flex-wrap items-center gap-2 text-sm text-slate-500">
          <Link href="/" className="transition hover:text-green-700">
            হোম
          </Link>

          <span>/</span>

          <span>{product.categoryNameBn}</span>

          <span>/</span>

          <span className="font-semibold text-slate-800">
            {product.nameBn}
          </span>
        </div>

        {/* Product Details */}
        <section className="grid overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-sm md:grid-cols-2">
          {/* Product Image */}
          <div className="flex min-h-72 flex-col items-center justify-center bg-gradient-to-br from-green-50 via-emerald-50 to-orange-50 p-10">
          {product.image &&
typeof product.image === "string" &&
/^https?:\/\//i.test(product.image) ? (
  <img
    src={product.image}
    alt={product.nameBn}
    className="h-64 w-full object-contain"
  />
) : (
  <div className="flex h-40 w-40 items-center justify-center rounded-3xl bg-white text-7xl shadow-sm">
    {product.categoryIcon || "🛒"}
  </div>
)}

            <span className="mt-6 rounded-full bg-white px-5 py-2 text-sm font-bold text-green-700 shadow-sm">
              {product.categoryNameBn}
            </span>
          </div>

          {/* Product Information */}
          <div className="p-7 md:p-10">
            <p className="font-semibold text-green-700">
              পণ্যের বিস্তারিত তথ্য
            </p>

            <h1 className="mt-3 text-3xl font-extrabold leading-tight md:text-4xl">
              {product.nameBn}
            </h1>

            <p className="mt-3 text-slate-500">
              প্রতি {product.unit}
            </p>

            {/* Today's Price */}
            <div className="mt-8 rounded-2xl bg-green-50 p-6">
              <p className="text-sm font-semibold text-slate-600">
                আজকের বাজারদর
              </p>

              <div className="mt-2 flex flex-wrap items-baseline gap-2">
                <span className="text-4xl font-extrabold text-green-700">
                  {formatPrice(product.today)}
                </span>

                <span className="text-slate-500">
                  / {product.unit}
                </span>
              </div>

              <div className="mt-4 flex flex-wrap items-center gap-3">
                <span
                  className={`rounded-full px-4 py-2 text-sm font-bold ${
                    priceDirection === "up"
                      ? "bg-red-100 text-red-700"
                      : priceDirection === "down"
                        ? "bg-green-100 text-green-800"
                        : "bg-slate-200 text-slate-700"
                  }`}
                >
                  {priceDirection === "up"
                    ? "▲ দাম বেড়েছে"
                    : priceDirection === "down"
                      ? "▼ দাম কমেছে"
                      : "— দাম অপরিবর্তিত"}
                </span>

                <span className="text-sm text-slate-600">
                  গতকালের তুলনায়{" "}
                  <strong
                    className={
                      priceDirection === "up"
                        ? "text-red-700"
                        : priceDirection === "down"
                          ? "text-green-700"
                          : "text-slate-700"
                    }
                  >
                    {priceDifference > 0 ? "+" : ""}
                    {formatPrice(priceDifference)}
                  </strong>
                </span>
              </div>
            </div>

            {/* API Price Change */}
            <div className="mt-5 rounded-2xl border border-slate-200 p-5">
              <p className="text-sm text-slate-500">
                API-তে দেওয়া দামের পরিবর্তন
              </p>

              <p
                className={`mt-2 text-2xl font-extrabold ${
                  product.change?.dir === "up"
                    ? "text-red-600"
                    : product.change?.dir === "down"
                      ? "text-green-700"
                      : "text-slate-700"
                }`}
              >
                {product.change?.dir === "up"
                  ? "▲ "
                  : product.change?.dir === "down"
                    ? "▼ "
                    : "— "}
                {Math.abs(product.change?.pct ?? 0)}%
              </p>
            </div>
          </div>
        </section>

        {/* Historical Price Comparison */}
        <section className="mt-12">
          <p className="font-semibold text-green-700">
            দামের ইতিহাস
          </p>

          <h2 className="mt-2 text-2xl font-extrabold md:text-3xl">
            আগের দামের সঙ্গে তুলনা
          </h2>

          <p className="mt-3 text-slate-500">
            বিভিন্ন সময়ের বাজারদর একসঙ্গে দেখে নিন।
          </p>

          <div className="mt-7 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {priceHistory.map((item) => (
              <article
                key={item.title}
                className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm transition hover:-translate-y-1 hover:shadow-md"
              >
                <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-green-50 text-2xl">
                  {item.icon}
                </div>

                <p className="mt-5 text-sm font-medium text-slate-500">
                  {item.title}
                </p>

                <p className="mt-2 text-2xl font-extrabold text-slate-900">
                  {formatPrice(item.price)}
                </p>

                <p className="mt-2 text-sm text-slate-500">
                  প্রতি {product.unit}
                </p>
              </article>
            ))}
          </div>
        </section>

        {/* Market Prices */}
        <section className="mt-14">
          <p className="font-semibold text-green-700">
            বাজারভিত্তিক তথ্য
          </p>

          <h2 className="mt-2 text-2xl font-extrabold md:text-3xl">
            বিভিন্ন বাজারে আজকের দাম
          </h2>

          <p className="mt-3 text-slate-500">
            API-তে পাওয়া বাজারগুলোর সর্বনিম্ন ও সর্বোচ্চ দাম দেখুন।
          </p>

          {product.markets && product.markets.length > 0 ? (
            <div className="mt-7 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
              {product.markets.map((market, index) => (
                <article
                  key={`${market.market}-${index}`}
                  className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm"
                >
                  <div className="flex items-start gap-3">
                    <span className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-orange-50 text-2xl">
                      🏪
                    </span>

                    <div>
                      <h3 className="font-bold text-slate-900">
                        {market.market}
                      </h3>

                      <p className="mt-1 text-sm text-slate-500">
                        বিভাগ: {market.division}
                      </p>
                    </div>
                  </div>

                  <div className="mt-6 space-y-3 border-t border-slate-100 pt-5">
                    <div className="flex items-center justify-between gap-3">
                      <span className="text-sm text-slate-500">
                        সর্বনিম্ন দাম
                      </span>

                      <span className="font-bold text-green-700">
                        {formatPrice(market.min)}
                      </span>
                    </div>

                    <div className="flex items-center justify-between gap-3">
                      <span className="text-sm text-slate-500">
                        সর্বোচ্চ দাম
                      </span>

                      <span className="font-bold text-red-600">
                        {formatPrice(market.max)}
                      </span>
                    </div>
                  </div>
                </article>
              ))}
            </div>
          ) : (
            <div className="mt-7 rounded-2xl border border-dashed border-slate-300 bg-white p-8 text-center">
              <div className="text-4xl">🏪</div>

              <p className="mt-3 font-bold text-slate-800">
                বাজারভিত্তিক তথ্য পাওয়া যায়নি
              </p>

              <p className="mt-2 text-sm text-slate-500">
                এই পণ্যের জন্য API-তে আলাদা বাজারের তথ্য নেই।
              </p>
            </div>
          )}
        </section>

        {/* Back Button */}
        <div className="mt-12 text-center">
          <Link
            href="/"
            className="inline-block rounded-xl bg-green-700 px-8 py-4 font-bold text-white shadow-sm transition hover:bg-green-800"
          >
            ← সব পণ্য দেখুন
          </Link>
        </div>
      </div>

      {/* Footer */}
      <footer className="bg-slate-950 px-6 py-8 text-center text-sm text-slate-400">
        © 2026 BazarDor. সর্বস্বত্ব সংরক্ষিত।
      </footer>
    </main>
  );
}