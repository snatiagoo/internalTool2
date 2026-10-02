"use client";

import { searchSaveOrchestrator } from "@/lib/projects/actions";
import { BUSINESS_TYPE_KEYWORDS, BusinessType } from "@/lib/keywords/keywords";
import { useState, useRef, use } from "react";
import { useFormStatus } from "react-dom";
import Link from "next/link";



function SubmitButton(){
    const { pending } = useFormStatus(); // this is taht thing
    return(
        <button
            type="submit"
            disabled={pending} // so if pending its disabled
            className="rounded-md bg-accent px-4 py-2 text-sm font-medium text-white hover:bg-accent-hover disabled:cursor-not-allowed disabled:opacity-50"
        >
            {pending ? "Searching..." : "Search"}
        </button>
    )
}




export default function Page({params} : {params: Promise<{id: string}>}) {

  const { id } = use(params);

  const [count, setCount] = useState(0);
  const [showResult, setIsShown] = useState(false);
  const [businessType, setBusinessType] = useState<BusinessType>("RESTAURANT");
  // useRef creates ref object, one that can be modified without changing state
  // hideTimer is a useRef that holds the timeout object at current
  // initially undefined
  const hideTimer = useRef<ReturnType<typeof setTimeout> | undefined>(undefined);

  async function handleAction(formData: FormData) {
    const projectId = Number((await params).id);
    const keyword = formData.get("keyword")?.toString() ?? "";
    const location = formData.get("location")?.toString() ?? "";
    const selectedType = formData.get("businessType")?.toString() as BusinessType;
    const baseKeywords: readonly string[] = BUSINESS_TYPE_KEYWORDS[selectedType] ?? [];
    const keywords = keyword.length > 0 ? [...baseKeywords, keyword] : [...baseKeywords];
    const maxReviews =
      formData.get("maxReviews") == "" ?
       undefined
      : Number(formData.get("maxReviews"));
    const res = await searchSaveOrchestrator(projectId, keywords, location, maxReviews);

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
    <main className="flex min-h-screen flex-1 flex-col">
      <header className="border-b border-border bg-accent px-6 py-4">
        <h1 className="text-lg font-semibold text-white">Prospectool</h1>
      </header>

      <div className="flex flex-1 flex-col items-center justify-center px-4">
      <div className="w-full max-w-md">
        <Link
          href={`/project/${id}`}
          className="mb-6 inline-block rounded-md border border-border px-4 py-2 text-sm hover:bg-accent-subtle"
        >
          Back to project
        </Link>
        <h1 className="mb-6 text-xl font-semibold">Prospecting Tool</h1>

        <form action={handleAction} className="flex flex-col gap-4">
          <div className="flex flex-col gap-1">
            <label htmlFor="businessType" className="text-sm font-medium">
              Business type
            </label>
            <select
              id="businessType"
              name="businessType"
              value={businessType}
              onChange={(e) => setBusinessType(e.target.value as BusinessType)}
              className="rounded-md border border-border bg-white px-3 py-2 text-sm outline-none focus:border-accent"
            >
              {Object.keys(BUSINESS_TYPE_KEYWORDS).map((type) => (
                <option key={type} value={type}>
                  {type}
                </option>
              ))}
            </select>
            <p className="text-xs text-muted">
              Searches: {BUSINESS_TYPE_KEYWORDS[businessType].join(", ")}
            </p>
          </div>

          <div className="flex flex-col gap-1">
            <label htmlFor="keyword" className="text-sm font-medium">
              Additional keyword (optional)
            </label>
            <input
              id="keyword"
              name="keyword"
              required={false}
              type="text"
              placeholder="e.g. peluquerías"
              className="rounded-md border border-border bg-white px-3 py-2 text-sm outline-none focus:border-accent"
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
              className="rounded-md border border-border bg-white px-3 py-2 text-sm outline-none focus:border-accent"
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
              className="rounded-md border border-border bg-white px-3 py-2 text-sm outline-none focus:border-accent"
            />
          </div>

          <SubmitButton />
        </form>
        <div>
          {showResult && <p className="text-sm font-medium text-accent">Added {count} new places.</p>}
        </div>
      </div>
      </div>
    </main>
  );
}
