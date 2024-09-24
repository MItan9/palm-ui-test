"use client";

import Link from "next/link";

export default function About() {
  return (
    <main className="min-h-screen">
      <div className="flex">
        <span className="ml-2"></span>
        <button>
          <Link href="/">Home</Link>
        </button>
        <span className="m-auto"></span>
        <h1>About</h1>
        <span className="m-auto"></span>
      </div>
      <div className="flex flex-col items-center justify-between p-24">
        <p>
          Test
        </p>
      </div>
    </main>
  );
}
