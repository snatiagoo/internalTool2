import { getPlacesByProjectId } from "@/app/lib/db/places";
import { notFound } from "next/navigation";



export default async function ProjectPage({p} : {p: Promise<{id: string}>}){
    
    const params = await p;

    if(!params) notFound();
    if(!params.id || !params.id.length) notFound();

    const id: number = Number(params.id);


    const places = await getPlacesByProjectId(id);


    






    
}