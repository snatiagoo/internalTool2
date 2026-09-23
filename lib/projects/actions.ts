'use server';

import { createProject } from "../db/projects";
import z from "zod";
import { refresh } from "next/cache";
import { searchAndSave } from "../db/places";

const formProjectSchema = z.object({
    projectName: z.string(),
    icp: z.string(),
})


export async function createProjectOrchestrator(formData: FormData){

    const rawProjectName = formData.get('projectName')?.toString();
    const projectName = rawProjectName?.length == 0 ? "ProjectName" : rawProjectName;

    const rawIcp = formData.get('icp') ? formData.get('icp') : "";
    
    
    const projectData = formProjectSchema.parse({
        projectName: projectName,
        icp: rawIcp
    })


    const project = await createProject(projectData);

    refresh();

    return project;
    
}


export async function searchSaveOrchestrator(projectId: number, keyword: string, location: string){
    if(!keyword.length && !location.length){
        // what should I do about this?
    }
    const res = await searchAndSave(projectId, keyword, location);
    return res;
}