"use client"
import {  useOrganization, useUser } from "@clerk/nextjs";
import { useMutation, useQuery } from "convex/react";
import { api } from "../../../../convex/_generated/api";
import { useState } from "react";
import Submitbutton from "@/app/dashboard/_components/Submitbutton";
import Filecard from "@/app/dashboard/_components/Filecard";
import Image from "next/image";
import { Columns, FileIcon, Files, GridIcon, Loader2, StarIcon, TableIcon } from "lucide-react";
import Searchbar from "./Searchbar";
import { DataTable } from "./file-table";

import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { Value } from "@radix-ui/react-select";
import { Doc } from "../../../../convex/_generated/dataModel";
import { columns } from "./columns";



export default function Placeholder({
  title,
  favoritesall,
  permdelete
}:
  {title:string,
   favoritesall?:boolean,
   permdelete?:boolean
  }) {
  const organization = useOrganization();
  const user = useUser();
  const [query, setQuery] = useState("");
  const [type,settype]=useState<Doc<"files">["type"] | "all">( "all")
 

  let orgId: string | undefined;
 
  if (organization.isLoaded && user.isLoaded) {
    orgId = organization.organization?.id || user.user?.id;
  }

  const favorites=useQuery(api.files.getAllfavs,
    orgId ? { orgId } : "skip");



  const getFiles =
   useQuery(api.files.getFiles,
     orgId ? 
     { orgId,
      type: type === "all" ? undefined : type,
       query,
       favorites:favoritesall,
       permdelete,
      } : "skip");

  const isLoading = getFiles === undefined;

  const modifiedFiles =
    getFiles?.map((file) => ({
      ...file,
      isFavorited: (favorites ?? []).some(
        (favorite) => favorite.fileId === file._id
      ),
    })) ?? [];

  return (
   <div>
        <div className="flex w-full justify-between mb-9">
          <h1 className="text-4xl font-bold">Your {title}</h1>
          <Searchbar query={query} setquery={setQuery} />
          <Submitbutton />
        </div>


        <Tabs defaultValue="Grid"  >
            <div className="flex justify-between">
              
            <TabsList className="mb-10" >
             <TabsTrigger value="Grid" className="gap-2">
             <GridIcon className="flex items-center h-6 w-6"/>
              Grid</TabsTrigger>

             <TabsTrigger value="Table" className="gap-2">
              <TableIcon  className="flex items-center h-6 w-6"/>
              Table</TabsTrigger>
            </TabsList>    
            <div>

       <div className="flex gap-2 items-center">
        <h1 className="text-1xl bg-black text-white p-1 rounded-md">Type Filter </h1>
        <Select  value={type} onValueChange={(newtype) => {
          settype(newtype as any)
        }} >

          <SelectTrigger className="w-[180px]">
           <SelectValue placeholder="All" />
          </SelectTrigger>
         <SelectContent>
       <SelectItem value="all">All</SelectItem>
        <SelectItem value="csv">CSV</SelectItem>
       <SelectItem value="image">Image</SelectItem>
       <SelectItem value="pdf">Pdf</SelectItem>
         </SelectContent>
        </Select>
        </div>
            </div>
            </div>
            
          <TabsContent value="Grid">

          <div className="grid grid-cols-3 gap-4 w-full">
              {modifiedFiles?.map((file: any) => {
                return (
                  <div key={file.id}>
                    <Filecard file={file} key={file._id} />
                  </div>
                );
              })}
              
            </div>
            </TabsContent>
          <TabsContent value="Table">
          <DataTable columns={columns} data={modifiedFiles} />
            </TabsContent>
          </Tabs>



       

        {isLoading ? (
          <div className="flex flex-col w-full gap-8 items-center mt-24">
            <div>
              <Loader2 className="h-32 w-32 animate-spin text-gray-500" />
            </div>
            <div className="text-2xl">Loading your Files</div>
          </div>
        ) : (
          <>

            {getFiles?.length === 0 && (
              <div className="flex flex-col gap-10 items-center w-full">
                <Image
                  alt="the empty image"
                  src="/empty.svg"
                  height="300"
                  width="300"
                />
                {!query ? (
                  <div className="text-2xl">You Have no Files, Upload now</div>
                ) : (
                  <div className="text-2xl">You Have no Files, With this Name</div>
                )}
                <Submitbutton />
              </div>
            )}
          </>
        )}
        </div>
  );
}
