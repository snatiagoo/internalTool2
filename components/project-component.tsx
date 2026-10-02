import { deleteProject } from "@/lib/db/projects";
import Link from "next/link";


export type Project = {
    id: number,
    projectName: string,
    icp: string | null
}

export function ProjectComponent({project} : {project: Project}){

    const id = project.id;


    return(
        <tr className="border-b border-border even:bg-accent-subtle/40">
            <td className="px-3 py-2 font-medium">{project.projectName}</td>
            <td className="px-3 py-2 text-muted">{project.icp ?? "—"}</td>
            <td className="px-3 py-2 text-right">
                <div className="flex justify-end gap-2">
                    <Link
                        href={`/project/${id}`}
                        className="rounded-md bg-accent px-3 py-1.5 text-sm font-medium text-white hover:bg-accent-hover"
                    >
                        Open
                    </Link>
                    <button
                        type="button"
                         onClick={() => deleteProject(id)}
                        aria-label="Delete project"
                        className="rounded-md border border-red-200 px-3 py-1.5 text-sm font-medium text-red-600 hover:bg-red-50"
                    >
                        Delete
                    </button>
                </div>
            </td>
        </tr>
    )
}
