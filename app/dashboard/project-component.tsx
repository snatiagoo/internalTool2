import Link from "next/link";


export type Project = {
    id: number,
    projectName: string,
    icp: string | null
}

export function ProjectComponent({project} : {project: Project}){

    const id = project.id;
    

    return(
        <div className="flex items-center justify-between gap-4 rounded-md border border-black/15 p-4 dark:border-white/20">
            <h2 className="text-base font-medium">{project.projectName}</h2>
            <Link
                href={`project/${id}`}
                className="rounded-md bg-foreground px-3 py-1.5 text-sm font-medium text-background"
            >
                Open
            </Link>
        </div>
    )
}