

import { db} from "../db"; 
import { projects } from "../db/schema";


export async function createProject(data: {name: string, icp: string}){
    const name = data.name;
    const icp = data.icp.length > 0 ? data.icp : undefined;

    
    await db.insert(projects).values({
        projectName: name,
        icp: icp
    }).returning();

}