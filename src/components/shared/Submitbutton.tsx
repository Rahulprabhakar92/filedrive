"use client"
import { Button } from "@/components/ui/button";
import {  useOrganization, useUser } from "@clerk/nextjs";
import { useMutation} from "convex/react";

import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { z } from "zod"
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod"
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { useState } from "react";
import { useToast } from "@/components/ui/use-toast";
import { Loader2 } from "lucide-react";
import { api } from "../../../convex/_generated/api";
import { Doc } from "../../../convex/_generated/dataModel";

const formSchema = z.object({
  title: z.string().min(2).max(200),
  file:z
  .custom<FileList>((val)=>val instanceof FileList ,"Required")
  .refine((files)=>files.length > 0,"Required")
})




export default function Submitbutton() {
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

 async function onSubmit(values: z.infer<typeof formSchema>) {
    if(!orgId) return 

    const postUrl = await generateUploadUrl();

    const result = await fetch(postUrl, {
      method: "POST",
      headers: { "Content-Type": values.file[0]!.type },
      body: values.file[0],
    });

    const { storageId } = await result.json();

    const types={
      'image/png':'image',
      'application/pdf':'pdf',
      'text/csv':'csv',
    }as Record <string , Doc<'files'>["type"]>


    try{
    
   await createFile({ 
      name:values.title,
      fileId:storageId,
      orgId:orgId ,
      type:types[values.file[0].type] 
    })
    form.reset()
    close(false)

    toast({
      variant:"success",
      title: "FILE UPLOAADED",
      description: "U DID IT ",
    })

    }catch(e){
      toast({
        variant:"destructive",
        title: "the file did not uplaoded late nigga",
        description: "u didnt make it man",
      })

    }

  }

  let orgId:string | undefined 

  if(organization.isLoaded && user.isLoaded){
    orgId=organization.organization?.id || user.user?.id
  }
  
  const createFile = useMutation(api.files.createFile);

  return (
   
      <Dialog open={open} onOpenChange={close}>
  <DialogTrigger asChild>
  <Button onClick={()=>{
        
      }}>Upload File</Button>
  </DialogTrigger>
  <DialogContent>
    <DialogHeader>
      <DialogTitle className="mb-8">Upload your File</DialogTitle>
      <DialogDescription>

      <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
        <FormField
          control={form.control}
          name="title"
          render={({ field }) => (
            <FormItem>
              <FormLabel>file</FormLabel>
              <FormControl>
                <Input placeholder="My file" {...field} />
              </FormControl>
              <FormDescription>
                Create the title of the file
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="file"
          render={() => (
            <FormItem>
              <FormLabel>file</FormLabel>
              <FormControl>
                <Input
                type="file" {...fileref}
                 />
              </FormControl>
              <FormDescription>
                Upload the file 
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />
        <Button type="submit"
         disabled={form.formState.isSubmitting} 
         className="flex gap-2">
          {form.formState.isSubmitting && (<Loader2 className="animate-spin mr-2 h-4 w-4" />)}
          Submit</Button>
      </form>
    </Form>
       
      </DialogDescription>
    </DialogHeader>
  </DialogContent>
</Dialog>  
  );
}
