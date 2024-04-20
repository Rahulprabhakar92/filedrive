"use client"
import {  useOrganization, useUser } from "@clerk/nextjs";
import { useMutation, useQuery } from "convex/react";
import { api } from "../../convex/_generated/api";
import { z } from "zod"
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod"
import { useState } from "react";
import { useToast } from "@/components/ui/use-toast";
import Submitbutton from "@/components/shared/submitbutton";
import Filecard from "@/components/shared/Filecard";


const formSchema = z.object({
  title: z.string().min(2).max(200),
  file:z
  .custom<FileList>((val)=>val instanceof FileList ,"Required")
  .refine((files)=>files.length > 0,"Required")
})




export default function Home() {
  const organization=useOrganization()
  const user= useUser()
  const generateUploadUrl = useMutation(api.files.generateUploadUrl);
  const { toast } = useToast()

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      title: "",
      file:undefined
    },
  })
  const fileref=form.register("file")

  const [open,close]=useState(false)

  

  let orgId:string | undefined 

  if(organization.isLoaded && user.isLoaded){
    orgId=organization.organization?.id || user.user?.id
  }
  
  const createFile = useMutation(api.files.createFile);
  const getfiles=useQuery(api.files.getFiles,orgId ? {orgId} : "skip")

  return (
    <main className="container mx-auto pt-12">
      <div className="flex justify-between items-center mb-8">
      <h1 className="text-4xl font-bold">Your Files</h1>
      <Submitbutton />
      </div>

      <div className="grid grid-cols-4 gap-3">
      {getfiles?.map((file:any)=>{
      return <div >
         <Filecard file={file}/>
      </div>
})}

      </div>
     
    </main>
  );
}
