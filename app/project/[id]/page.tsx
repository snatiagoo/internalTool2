import { Project } from "@/app/dashboard/project-component";



export default async function ProjectPage({params} : {params: Promise<{id: string}>}){
    const id = Number(await params);
    

    
}