import { ProjectModalComponent } from "./dashboard/form-component";
import { Project, ProjectComponent } from "./dashboard/project-component";
import { getProjects } from "./lib/db/projects";

export default async function Dashboard(){

    const projects: Project[] = await getProjects();

    return(
        <main>
            <div>
                {projects.map((project) => (
                    <ProjectComponent key={project.id} project={project} />
                ))}
            </div>
            <ProjectModalComponent />
        </main>
        
    );

}