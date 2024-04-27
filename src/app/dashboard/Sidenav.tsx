'use client'

import { Button } from "@/components/ui/button"
import clsx from "clsx"
import { FileIcon, StarIcon, TrashIcon } from "lucide-react"
import Link from "next/link"
import { usePathname } from "next/navigation"

export default function Sidenav(){
  const path=usePathname()
    return(
        <div className="w-40 flex flex-col gap-4"> 
        <Link href='/dashboard/files'>
        <Button variant={'link'} className={clsx("flex,gap-2",{
          "text-blue-400":path.includes('dashboard/files'),
        })}>
          <FileIcon className="mr-1"/>All files
        </Button>
        </Link>
  
        <Link href='/dashboard/favorites'>
        <Button variant={'link'} className={clsx("flex,gap-4",{
          "text-blue-400":path.includes('dashboard/favorites'),
        })}>
          <StarIcon className="mr-1"/>Favorites
        </Button>
        </Link>

        <Link href='/dashboard/Trash'>
        <Button variant={'link'} className={clsx("flex,gap-2",{
          "text-blue-400":path.includes('dashboard/Trash'),
        })}>
          <TrashIcon className="mr-1"/>Trash 
        </Button>
        </Link>
  
        </div>
    )
}