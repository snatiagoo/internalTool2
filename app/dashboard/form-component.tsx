
'use client';
import { useState } from "react";
// remember server actions are allowed inside client files
// and also async functions insdie the component


import { createProjectOrchestrator } from "../lib/projects/actions"

export function ProjectModalComponent(){
    const [isOpen, setOpen] = useState(false);

    async function handleAction(formData: FormData){
        await createProjectOrchestrator(formData);

        setOpen(false);
    }


    return(
    <>
        <button
            onClick={() => setOpen(true)}
            aria-label="Create project"
            className="fixed bottom-6 right-6 flex h-12 w-12 items-center justify-center rounded-full bg-foreground text-2xl text-background shadow-lg"
        >
            +
        </button>
        {isOpen && (
            <div
                onClick={() => setOpen(false)}
                className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 px-4"
            >
                <div
                    onClick={(e) => e.stopPropagation()}
                    className="w-full max-w-md rounded-md bg-background p-6 text-foreground shadow-lg"
                >
                    <h2 className="mb-4 text-lg font-semibold">New project</h2>

                    <form action={handleAction} className="flex flex-col gap-4">
                        <div className="flex flex-col gap-1">
                            <label htmlFor="projectName" className="text-sm font-medium">
                                Project name
                            </label>
                            <input
                                id="projectName"
                                name="projectName"
                                type="text"
                                placeholder="e.g. Restaurants in Madrid"
                                className="rounded-md border border-black/15 bg-transparent px-3 py-2 text-sm outline-none focus:border-black/40 dark:border-white/20 dark:focus:border-white/40"
                            />
                        </div>

                        <div className="flex flex-col gap-1">
                            <label htmlFor="icp" className="text-sm font-medium">
                                ICP (ideal customer profile)
                            </label>
                            <textarea
                                id="icp"
                                name="icp"
                                rows={4}
                                placeholder="Optional: who are you targeting?"
                                className="rounded-md border border-black/15 bg-transparent px-3 py-2 text-sm outline-none focus:border-black/40 dark:border-white/20 dark:focus:border-white/40"
                            />
                        </div>

                        <div className="mt-2 flex justify-end gap-2">
                            <button
                                type="button"
                                onClick={() => setOpen(false)}
                                className="rounded-md border border-black/15 px-4 py-2 text-sm dark:border-white/20"
                            >
                                Cancel
                            </button>
                            <button
                                type="submit"
                                className="rounded-md bg-foreground px-4 py-2 text-sm font-medium text-background"
                            >
                                Create
                            </button>
                        </div>
                    </form>
                </div>
            </div>

            )
        }
    </>

    )
}
