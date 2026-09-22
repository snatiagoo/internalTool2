"use client";

import { searchAndSave } from "@/app/lib/db/places";
import { useState } from "react";

export default function Page({params} : {params: Promise<{id: string}>}) {
  const [keyword, setKeyword] = useState("");
  const [location, setLocation] = useState("");

  async function handleSubmit(e: React.SubmitEvent) {
    e.preventDefault();
    const projetId = Number((await params).id);
    console.log({ keyword, location });

    await searchAndSave(projetId, keyword, location);
  }

  return (
    <main className="flex flex-1 flex-col items-center justify-center px-4">
      <div className="w-full max-w-md">
        <h1 className="mb-6 text-xl font-semibold">Prospecting Tool</h1>

        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          <div className="flex flex-col gap-1">
            <label htmlFor="keyword" className="text-sm font-medium">
              Business type / keyword
            </label>
            <input
              id="keyword"
              type="text"
              value={keyword}
              onChange={(e) => setKeyword(e.target.value)}
              placeholder="e.g. peluquerías"
              className="rounded-md border border-black/15 bg-transparent px-3 py-2 text-sm outline-none focus:border-black/40 dark:border-white/20 dark:focus:border-white/40"
            />
          </div>

          <div className="flex flex-col gap-1">
            <label htmlFor="location" className="text-sm font-medium">
              Location
            </label>
            <input
              id="location"
              type="text"
              value={location}
              onChange={(e) => setLocation(e.target.value)}
              placeholder="e.g. Valencia, España"
              className="rounded-md border border-black/15 bg-transparent px-3 py-2 text-sm outline-none focus:border-black/40 dark:border-white/20 dark:focus:border-white/40"
            />
          </div>

          <button
            type="submit"
            className="mt-2 rounded-md bg-foreground px-4 py-2 text-sm font-medium text-background"
          >
            Search
          </button>
        </form>
      </div>
    </main>
  );
}
