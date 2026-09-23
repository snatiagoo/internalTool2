"use client";

import { searchSaveOrchestrator } from "@/lib/projects/actions";
import { useState } from "react";
import { useFormStatus } from "react-dom";



function SubmitButton(){
    const { pending } = useFormStatus(); // this is taht thing
    return(
        <button
            type="submit"
            disabled={pending} // so if pending its disabled
            className="rounded-md bg-foreground px-4 py-2 text-sm font-medium text-background disabled:cursor-not-allowed disabled:opacity-50"
        >
            {pending ? "Searching..." : "Search"}
        </button>
    )
}




export default function Page({params} : {params: Promise<{id: string}>}) {

  const [count, setCount] = useState(0);
  const [showResult, setIsShown] = useState(false);

  async function handleAction(formData: FormData) {
    const projectId = Number((await params).id);
    const keyword = formData.get("keyword")?.toString() ?? "";
    const location = formData.get("location")?.toString() ?? "";
    const res = await searchSaveOrchestrator(projectId, keyword, location);

    setCount(res);
    setIsShown(true);

  }

  return (
    <main className="flex flex-1 flex-col items-center justify-center px-4">
      <div className="w-full max-w-md">
        <h1 className="mb-6 text-xl font-semibold">Prospecting Tool</h1>

        <form action={handleAction} className="flex flex-col gap-4">
          <div className="flex flex-col gap-1">
            <label htmlFor="keyword" className="text-sm font-medium">
              Business type / keyword
            </label>
            <input
              id="keyword"
              required={true}
              type="text"
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
              required={true}
              type="text"
              placeholder="e.g. Valencia, España"
              className="rounded-md border border-black/15 bg-transparent px-3 py-2 text-sm outline-none focus:border-black/40 dark:border-white/20 dark:focus:border-white/40"
            />
          </div>

          <SubmitButton />
        </form>
      </div>
    </main>
  );
}
