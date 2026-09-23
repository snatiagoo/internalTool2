import { getPlacesByProjectId } from "@/lib/db/places";
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
            <header className="flex gap-2 p-4">
                <Link
                    href="/"
                    className="rounded-md border border-black/15 px-4 py-2 text-sm dark:border-white/20"
                >
                    Go back
                </Link>
                <Link
                    href={`/project/${id}/search`}
                    className="rounded-md bg-foreground px-4 py-2 text-sm font-medium text-background"
                >
                    Search more
                </Link>
            </header>

            <div className="px-4 pb-4">
                {places.length === 0 ? (
                    <p className="text-sm opacity-70">No places saved to this project yet.</p>
                ) : (
                    <div className="overflow-x-auto">
                        <table className="w-full min-w-180 border-collapse text-sm">
                            <thead>
                                <tr className="border-b border-black/15 text-left dark:border-white/20">
                                    <th className="px-3 py-2 font-medium">Name</th>
                                    <th className="px-3 py-2 font-medium">Type</th>
                                    <th className="px-3 py-2 font-medium">Rating</th>
                                    <th className="px-3 py-2 font-medium">Reviews</th>
                                    <th className="px-3 py-2 font-medium">Maps</th>
                                </tr>
                            </thead>
                            <tbody>
                                {places.map((place) => (
                                    <tr
                                        key={place.id}
                                        className="border-b border-black/10 even:bg-black/2 dark:border-white/10 dark:even:bg-white/3"
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
                                                className="underline"
                                            >
                                                Open
                                            </a>
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
