
'use client';
import { useState } from "react";
import { useFormStatus } from "react-dom";
// remember server actions are allowed inside client files
// and also async functions insdie the component


import { createProjectOrchestrator } from "../lib/projects/actions"

// useFormStatus reads the state of the <form> this component is rendered inside,
// so it has to be its own component (it can't be called in the component that renders the <form>)
function SubmitButton(){
    const { pending } = useFormStatus(); // this is taht thing

    return(
        <button
            type="submit"
            disabled={pending} // so if pending its disabled
            className="rounded-md bg-accent px-4 py-2 text-sm font-medium text-white hover:bg-accent-hover disabled:cursor-not-allowed disabled:opacity-50"
        >
            {pending ? "Creating..." : "Create"}
        </button>
    )
}

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
            className="fixed bottom-6 right-6 flex h-12 w-12 items-center justify-center rounded-full bg-accent text-2xl text-white shadow-lg hover:bg-accent-hover"
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
                                className="rounded-md border border-border bg-white px-3 py-2 text-sm outline-none focus:border-accent"
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
                                className="rounded-md border border-border bg-white px-3 py-2 text-sm outline-none focus:border-accent"
                            />
                        </div>

                        <div className="mt-2 flex justify-end gap-2">
                            <button
                                type="button"
                                onClick={() => setOpen(false)}
                                className="rounded-md border border-border px-4 py-2 text-sm hover:bg-accent-subtle"
                            >
                                Cancel
                            </button>
                            <SubmitButton />
                        </div>
                    </form>
                </div>
            </div>

            )
        }
    </>

    )
}
