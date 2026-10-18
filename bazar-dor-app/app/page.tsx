import { Suspense } from "react";
import { connection } from "next/server";
import ProductCatalog from "../components/ProductCatalog";

type Product = {
  id: number;
  slug: string;
  nameBn: string;
  category: string;
  categoryNameBn: string;
  categoryIcon: string;
  unit: string;
  image: string;
  today: number;
  yesterday: number;
  lastWeek: number;
  lastMonth: number;
  change: {
    dir: "up" | "down" | "same";
    pct: number;
  };
  markets?: {
    market: string;
    division: string;
    min: number;
    max: number;
  }[];
};

// API থেকে পণ্যের তথ্য আনা
async function getProducts(): Promise<Product[]> {
  try {
    const response = await fetch(
      "https://openapi.programming-hero.com/api/bazardor/products",
      {
        cache: "no-store",
        signal: AbortSignal.timeout(5000),
      }
    );

    if (!response.ok) {
      throw new Error(`Product API failed: ${response.status}`);
    }

    const result = await response.json();

    const data = Array.isArray(result)
      ? result
      : Array.isArray(result?.data)
        ? result.data
        : Array.isArray(result?.products)
          ? result.products
          : Array.isArray(result?.data?.products)
            ? result.data.products
            : [];

    return data as Product[];
  } catch (error) {
    console.error("Product API error:", error);
    return [];
  }
}

export default function Home() {
  return (
    <Suspense
      fallback={
        <main className="flex min-h-screen items-center justify-center bg-slate-50">
          <p className="text-lg font-semibold text-green-700">
            বাজারদরের তথ্য লোড হচ্ছে...
          </p>
        </main>
      }
    >
      <HomeContent />
    </Suspense>
  );
}

async function HomeContent() {
  // Request আসার পর dynamic data load হবে।
  // এতে prerender-এর সময় external API fetch করার সমস্যা এড়ানো যায়।
  await connection();

  const products = await getProducts();
  const popularProducts = products.slice(0, 3);

  const categories = Array.from(
    new Map(
      products.map((product) => [
        product.category,
        {
          category: product.category,
          categoryNameBn: product.categoryNameBn,
          categoryIcon: product.categoryIcon,
        },
      ])
    ).values()
  );

  return (
    <main className="min-h-screen bg-slate-50 text-slate-900">
      {/* Navbar */}
      <header className="border-b border-slate-200 bg-white">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-6 py-5">
          <a
            href="/"
            className="text-2xl font-extrabold text-green-700"
          >
            Bazar<span className="text-orange-500">Dor</span>
          </a>

          <nav className="hidden items-center gap-7 text-sm font-medium md:flex">
            <a href="/" className="text-green-700">
              হোম
            </a>

            <a href="#prices" className="hover:text-green-700">
              বাজারদর
            </a>

            <a href="#categories" className="hover:text-green-700">
              ক্যাটাগরি
            </a>

            <a href="#about" className="hover:text-green-700">
              আমাদের সম্পর্কে
            </a>
          </nav>

          <a
            href="/login"
            className="rounded-lg bg-green-700 px-5 py-2.5 text-sm font-semibold text-white hover:bg-green-800"
          >
            লগইন
          </a>
        </div>
      </header>

      {/* Hero Section */}
      <section className="bg-gradient-to-r from-green-950 via-green-800 to-green-700 text-white">
        <div className="mx-auto grid max-w-7xl items-center gap-10 px-6 py-20 md:grid-cols-2 md:py-28">
          <div>
            <p className="mb-5 inline-block rounded-full border border-green-300/40 bg-white/10 px-4 py-2 text-sm">
              বাংলাদেশের বাজারদর এখন এক জায়গায়
            </p>

            <h1 className="text-4xl font-extrabold leading-tight md:text-6xl">
              প্রতিদিনের বাজারদর,
              <br />
              <span className="text-orange-300">
                এখন আপনার হাতেই
              </span>
            </h1>

            <p className="mt-6 max-w-xl leading-8 text-green-100">
              চাল, ডাল, তেলসহ নিত্যপ্রয়োজনীয় পণ্যের দাম দেখুন।
              কোন পণ্যের দাম বাড়ছে আর কোনটির দাম কমছে,
              তা সহজেই জানুন।
            </p>

            <a
              href="#prices"
              className="mt-8 inline-block rounded-xl bg-orange-500 px-7 py-3.5 font-bold text-white transition hover:bg-orange-600"
            >
              আজকের বাজারদর দেখুন →
            </a>

            <p className="mt-5 text-sm text-green-200">
              সহজে জানুন · সচেতনভাবে বাজার করুন
            </p>
          </div>

          {/* Popular Products */}
          <div className="rounded-3xl border border-white/15 bg-white/10 p-5 shadow-2xl backdrop-blur-sm md:p-8">
            <div className="mb-6 flex items-center justify-between">
              <div>
                <p className="text-sm text-green-100">
                  লাইভ API ডেটা
                </p>

                <h2 className="mt-1 text-2xl font-bold">
                  জনপ্রিয় পণ্য
                </h2>
              </div>

              <span className="rounded-full bg-green-400/20 px-3 py-1 text-xs text-green-100">
                Live Data
              </span>
            </div>

            <div className="space-y-3">
              {popularProducts.map((product) => (
                <div
                  key={product.id}
                  className="flex items-center justify-between gap-3 rounded-xl bg-white p-4 text-slate-900"
                >
                  <div>
                    <h3 className="font-bold">
                      {product.nameBn}
                    </h3>

                    <p className="mt-1 text-xs text-slate-500">
                      প্রতি{" "}
                      {product.unit === "kg"
                        ? "কেজি"
                        : product.unit === "liter"
                          ? "লিটার"
                          : product.unit}
                    </p>
                  </div>

                  <div className="text-right">
                    <p className="font-extrabold">
                      ৳{product.today}
                    </p>

                    <p
                      className={`mt-1 text-xs font-semibold ${
                        product.change?.dir === "up"
                          ? "text-red-600"
                          : product.change?.dir === "down"
                            ? "text-green-600"
                            : "text-slate-500"
                      }`}
                    >
                      {product.change?.dir === "up"
                        ? "▲"
                        : product.change?.dir === "down"
                          ? "▼"
                          : "—"}{" "}
                      {Math.abs(product.change?.pct ?? 0)}%
                    </p>
                  </div>
                </div>
              ))}

              {products.length === 0 && (
                <p className="rounded-xl bg-white p-4 text-sm text-slate-700">
                  এই মুহূর্তে প্রোডাক্ট লোড করা যাচ্ছে না।
                  পরে আবার চেষ্টা করুন।
                </p>
              )}
            </div>

            <p className="mt-4 text-xs leading-5 text-green-100">
              প্রদর্শিত দাম API থেকে নেওয়া হয়েছে।
            </p>
          </div>
        </div>
      </section>

      {/* All Products and Search */}
      <section
        id="prices"
        className="mx-auto max-w-7xl px-6 py-16"
      >
        <div className="mb-8">
          <p className="font-semibold text-green-700">
            আজকের বাজার
          </p>

          <h2 className="mt-2 text-3xl font-extrabold">
            নিত্যপ্রয়োজনীয় পণ্যের দাম
          </h2>

          <p className="mt-3 text-slate-600">
            পণ্যের নাম লিখে সহজেই আজকের বাজারদর খুঁজে নিন।
          </p>
        </div>

        {products.length > 0 ? (
          <ProductCatalog products={products} />
        ) : (
          <div className="rounded-2xl border border-slate-200 bg-white p-10 text-center">
            <p className="text-lg font-bold text-slate-800">
              প্রোডাক্ট পাওয়া যায়নি
            </p>

            <p className="mt-2 text-slate-500">
              API থেকে তথ্য পাওয়া যাচ্ছে না।
              কিছুক্ষণ পরে আবার চেষ্টা করুন।
            </p>
          </div>
        )}

        {products.length > 0 && (
          <p className="mt-6 text-sm text-slate-500">
            মোট {products.length}টি প্রোডাক্ট API থেকে লোড হয়েছে।
          </p>
        )}
      </section>

      {/* Categories */}
      <section id="categories" className="bg-white py-16">
        <div className="mx-auto max-w-7xl px-6">
          <div className="text-center">
            <p className="font-semibold text-green-700">
              পণ্য খুঁজুন
            </p>

            <h2 className="mt-2 text-3xl font-extrabold">
              ক্যাটাগরি অনুযায়ী বাজারদর
            </h2>
          </div>

          <div className="mt-10 grid grid-cols-2 gap-4 md:grid-cols-4">
            {categories.map((category) => (
              <a
                key={category.category}
                href="#prices"
                className="rounded-2xl border border-slate-200 p-6 text-center transition hover:border-green-600 hover:bg-green-50"
              >
                <span className="text-3xl">
                  {category.categoryIcon}
                </span>

                <p className="mt-3 font-bold">
                  {category.categoryNameBn}
                </p>

                <p className="mt-2 text-sm text-slate-500">
                  পণ্যের দাম দেখুন →
                </p>
              </a>
            ))}
          </div>

          {products.length === 0 && (
            <p className="mt-6 text-center text-slate-500">
              API থেকে ক্যাটাগরির তথ্য পাওয়া যায়নি।
            </p>
          )}
        </div>
      </section>

      {/* Footer */}
      <footer id="about" className="bg-slate-950 text-white">
        <div className="mx-auto max-w-7xl px-6 py-10">
          <a href="/" className="text-2xl font-extrabold">
            Bazar<span className="text-orange-400">Dor</span>
          </a>

          <p className="mt-3 max-w-xl text-sm leading-6 text-slate-300">
            বাংলাদেশের নিত্যপ্রয়োজনীয় পণ্যের বাজারদর সহজে
            জানার একটি প্ল্যাটফর্ম। আমাদের লক্ষ্য বাজার সম্পর্কে
            মানুষকে সচেতন হতে সাহায্য করা।
          </p>

          <div className="mt-8 border-t border-slate-800 pt-5 text-sm text-slate-400">
            © 2026 Bazar Dor. All rights reserved.
          </div>
        </div>
      </footer>
    </main>
  );
}