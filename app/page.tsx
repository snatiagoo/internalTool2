import { ProjectModalComponent } from "../components/form-component";
import { Project, ProjectComponent } from "../components/project-component";
import { getProjects } from "../lib/db/projects";

export default async function Dashboard(){

    const projects: Project[] = await getProjects();

    return(
        <main className="min-h-screen">
            <header className="border-b border-border bg-accent px-6 py-4">
                <h1 className="text-lg font-semibold text-white">Prospectool</h1>
            </header>

            <div className="p-6">
                {projects.length === 0 ? (
                    <p className="text-sm text-muted">No projects yet — create one with the button in the corner.</p>
                ) : (
                    <div className="overflow-x-auto rounded-md border border-border">
                        <table className="w-full min-w-150 border-collapse text-sm">
                            <thead>
                                <tr className="border-b border-border bg-accent-subtle text-left">
                                    <th className="px-3 py-2 font-medium">Project</th>
                                    <th className="px-3 py-2 font-medium">ICP</th>
                                    <th className="px-3 py-2 font-medium"></th>
                                </tr>
                            </thead>
                            <tbody>
                                {projects.map((project) => (
                                    <ProjectComponent key={project.id} project={project} />
                                ))}
                            </tbody>
                        </table>
                    </div>
                )}
            </div>

            <ProjectModalComponent />
        </main>
    );

}
