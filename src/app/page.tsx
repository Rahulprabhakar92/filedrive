"use client"
import { Button } from "@/components/ui/button";
import { SignInButton, SignOutButton, SignedIn, SignedOut, useOrganization, useUser } from "@clerk/nextjs";
import { useMutation, useQuery } from "convex/react";
import { api } from "../../convex/_generated/api";
import { create } from "domain";
import { createFile } from "../../convex/files";



export default function Home() {
  const organization=useOrganization()
  const user= useUser()
  let orgId:string | undefined 

  if(organization.isLoaded && user.isLoaded){
    orgId=organization.organization?.id || user.user?.id
  }
  
  const createFile = useMutation(api.files.createFile);
  const getfiles=useQuery(api.files.getFiles,orgId ? {orgId} : "skip")

  return (
    <main className="flex min-h-screen flex-col items-center justify-between p-24">
     {getfiles?.map((file:any)=>{
      return <div>{file.name}</div>
})}
      <Button onClick={()=>{
         if(!orgId) return 
      createFile({ 
        name:"hello world",
        orgId:orgId
      })
      }}>Click here</Button>
      
    
    </main>
  );
}
