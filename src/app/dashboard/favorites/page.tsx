'use client'
import { useQuery } from "convex/react";
import Placeholder from "../_components/Placeholder";
import { api } from "../../../../convex/_generated/api";

 
export default function favorites(){
  
  return(
  <div>
    <Placeholder title="Favorites" favorites={true}/>
  </div>
  )
}