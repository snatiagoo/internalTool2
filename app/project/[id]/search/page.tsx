"use client";

import { searchSaveOrchestrator } from "@/lib/projects/actions";
import { useState, useRef, use } from "react";
import { useFormStatus } from "react-dom";
import Link from "next/link";



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

  const { id } = use(params);

  const [count, setCount] = useState(0);
  const [showResult, setIsShown] = useState(false);
  // useRef creates ref object, one that can be modified without changing state
  // hideTimer is a useRef that holds the timeout object at current
  // initially undefined
  const hideTimer = useRef<ReturnType<typeof setTimeout> | undefined>(undefined);

  async function handleAction(formData: FormData) {
    const projectId = Number((await params).id);
    const keyword = formData.get("keyword")?.toString() ?? "";
    const location = formData.get("location")?.toString() ?? "";
    const maxReviews = 
      formData.get("maxReviews") == "" ?
       undefined
      : Number(formData.get("maxReviews"));
    const res = await searchSaveOrchestrator(projectId, keyword, location, maxReviews);

    setCount(res);
    setIsShown(true);
    // handleAction causes a kill on the active timer 
    // (in case we click twice for example)
    // or does nothing if already fired/first
    // .current is what the timeout object is
    clearTimeout(hideTimer.current);

    // setTimeout creates a new Timeout object
    // to be hideTimer ref object current
    hideTimer.current = setTimeout(() => setIsShown(false), 3000);
    

    // so it repeats this have ref, cancel its timeout (done or nothing)
    // and create new delay for the shown on each form action
    
    //use ref whenever you need 
    // "a value that outlives renders (consistent), 
    // but isn't part of what the component displays"
  }

  

  return (
    <main className="flex flex-1 flex-col items-center justify-center px-4">
      <div className="w-full max-w-md">
        <Link
          href={`/project/${id}`}
          className="mb-6 inline-block rounded-md border border-black/15 px-4 py-2 text-sm dark:border-white/20"
        >
          Back to project
        </Link>
        <h1 className="mb-6 text-xl font-semibold">Prospecting Tool</h1>

        <form action={handleAction} className="flex flex-col gap-4">
          <div className="flex flex-col gap-1">
            <label htmlFor="keyword" className="text-sm font-medium">
              Business type / keyword
            </label>
            <input
              id="keyword"
              name="keyword"
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
              name="location"
              required={true}
              type="text"
              placeholder="e.g. Valencia, España"
              className="rounded-md border border-black/15 bg-transparent px-3 py-2 text-sm outline-none focus:border-black/40 dark:border-white/20 dark:focus:border-white/40"
            />
          </div>

          <div className="flex flex-col gap-1">
            <label htmlFor="location" className="text-sm font-medium">
              Max Reviews
            </label>
            <input
              id="maxReviews"
              name="maxReviews"
              required={false}
              type="text"
              placeholder="e.g. 2000"
              className="rounded-md border border-black/15 bg-transparent px-3 py-2 text-sm outline-none focus:border-black/40 dark:border-white/20 dark:focus:border-white/40"
            />
          </div>

          <SubmitButton />
        </form>
        <div>
          {showResult && <p className="text-sm">Added {count} new places.</p>}
        </div>
      </div>
    </main>
  );
}
