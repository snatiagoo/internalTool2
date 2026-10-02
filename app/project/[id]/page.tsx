import { deletePlace, getPlacesByProjectId } from "@/lib/db/places";
import { deletePlaceAction } from "@/lib/projects/actions";
import Link from "next/link";
import { notFound } from "next/navigation";



export default async function ProjectPage({ params }: { params: Promise<{ id: string }> }) {

    const resolvedParams = await params;

    if (!resolvedParams) notFound();
    if (!resolvedParams.id || !resolvedParams.id.length) notFound();

    const id: number = Number(resolvedParams.id);


    const places = await getPlacesByProjectId(id);


    return (
        <main>
            <header className="flex items-center justify-between gap-2 border-b border-border bg-accent px-6 py-4">
                <h1 className="text-lg font-semibold text-white">Prospectool</h1>
                <div className="flex gap-2">
                    <Link
                        href="/"
                        className="rounded-md border border-white/40 px-4 py-2 text-sm text-white hover:bg-white/10"
                    >
                        Go back
                    </Link>
                    <Link
                        href={`/project/${id}/search`}
                        className="rounded-md bg-white px-4 py-2 text-sm font-medium text-accent hover:bg-accent-subtle"
                    >
                        Search more
                    </Link>
                </div>
            </header>

            <div className="p-6">
                {places.length === 0 ? (
                    <p className="text-sm text-muted">No places saved to this project yet.</p>
                ) : (
                    <div className="overflow-x-auto rounded-md border border-border">
                        <table className="w-full min-w-180 border-collapse text-sm">
                            <thead>
                                <tr className="border-b border-border bg-accent-subtle text-left">
                                    <th className="px-3 py-2 font-medium">Name</th>
                                    <th className="px-3 py-2 font-medium">Type</th>
                                    <th className="px-3 py-2 font-medium">Rating</th>
                                    <th className="px-3 py-2 font-medium">Reviews</th>
                                    <th className="px-3 py-2 font-medium">Maps</th>
                                    <th className="px-3 py-2 font-medium"></th>
                                </tr>
                            </thead>
                            <tbody>
                                {places.map((place) => (
                                    <tr
                                        key={place.id}
                                        className="border-b border-border even:bg-accent-subtle/40"
                                    >
                                        <td className="px-3 py-2">{place.displayName}</td>
                                        <td className="px-3 py-2">{place.primaryTypeDisplayName ?? "—"}</td>
                                        <td className="px-3 py-2">{place.rating ?? "—"}</td>
                                        <td className="px-3 py-2">{place.userRatingCount ?? "—"}</td>
                                        <td className="px-3 py-2">
                                            <a
                                                href={place.googleMapsUri}
                                                target="_blank"
                                                rel="noopener noreferrer"
                                                className="text-accent underline hover:text-accent-hover"
                                            >
                                                Open
                                            </a>
                                        </td>
                                        <td className="px-3 py-2 text-right">
                                            <form action={deletePlaceAction.bind(null, place.id)}>
                                                <button
                                                    type="submit"
                                                    aria-label="Delete place"
                                                    className="rounded-md border border-red-200 px-3 py-1.5 text-sm font-medium text-red-600 hover:bg-red-50"
                                                >
                                                    Delete
                                                </button>
                                            </form>
                                                
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                )}
            </div>
        </main>
    )

}
