"use client"
import {  useOrganization, useUser } from "@clerk/nextjs";
import { useMutation, useQuery } from "convex/react";
import { api } from "../../../../convex/_generated/api";
import { set, z } from "zod"
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod"
import { useState } from "react";
import { useToast } from "@/components/ui/use-toast";
import Submitbutton from "@/app/dashboard/_components/Submitbutton";
import Filecard from "@/app/dashboard/_components/Filecard";
import Image from "next/image";
import { FileIcon, Files, Loader2, StarIcon } from "lucide-react";
import Searchbar from "./Searchbar";
import { Button } from "@/components/ui/button";
import Link from "next/link";






export default function Placeholder({title,favorites}:{title:string,favorites?:boolean}) {
  const organization = useOrganization();
  const user = useUser();
  const [query, setQuery] = useState("");

  let orgId: string | undefined;

  if (organization.isLoaded && user.isLoaded) {
    orgId = organization.organization?.id || user.user?.id;
  }

  const getFiles = useQuery(api.files.getFiles, orgId ? { orgId, query,favorites } : "skip");
  const isLoading = getFiles === undefined;

  return (
   <div>
        <div className="flex w-full justify-between mb-20">
         
          <h1 className="text-4xl font-bold">Your {title}</h1>
          <Searchbar query={query} setquery={setQuery} />
          <Submitbutton />
        </div>

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
            <div className="grid grid-cols-3 gap-4">
              {getFiles?.map((file: any) => {
                return (
                  <div key={file.id}>
                    <Filecard file={file} url={file.url} />
                  </div>
                );
              })}
            </div>
          </>
        )}
        </div>
  );
}
