

import { db} from "."; 
import { desc, eq } from "drizzle-orm";
import { placesTable, projects } from "./schema";




export async function createProject(data: {projectName: string, icp: string}){
    const name = data.projectName;
    const icp = data.icp.length > 0 ? data.icp : undefined;

    
    await db.insert(projects).values({
        projectName: name,
        icp: icp
    }).returning();

}



export async function getProjects(){
    const p = await db.select().from(projects).orderBy(desc(projects.id));

    return p;
}


