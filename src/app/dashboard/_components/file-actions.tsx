import React, { ReactNode, useState } from 'react'


  import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
  } from "@/components/ui/dropdown-menu"

  import {
    AlertDialog,
    AlertDialogAction,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
    AlertDialogTrigger,
  } from "@/components/ui/alert-dialog"
  

  
  import { Doc, Id } from '../../../../convex/_generated/dataModel'
import { Button } from '../../../components/ui/button'
import { DeleteIcon, FileTextIcon, ImageIcon, MoreVertical, TrashIcon,GanttChartIcon, FileDiff, StarIcon } from 'lucide-react'
import { useMutation,  useQuery } from 'convex/react'
import { api } from '../../../../convex/_generated/api'
import { toast } from '../../../components/ui/use-toast'



export default function FileCardActions({file}:{file:Doc<'files'>} ){
    const [Isconfiremed,setconfiremed]=useState(false)
    const deletefile= useMutation(api.files.deletefile)
    const Favorite=useMutation(api.files.Favorite)


    return(

        <>
<AlertDialog open={Isconfiremed} onOpenChange={setconfiremed}>
  <AlertDialogContent>
    <AlertDialogHeader>
      <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
      <AlertDialogDescription>
        This action cannot be undone. This will permanently delete your File
        and remove your data from our servers.
      </AlertDialogDescription>
    </AlertDialogHeader>
    <AlertDialogFooter>
      <AlertDialogCancel>Cancel</AlertDialogCancel>
      <AlertDialogAction onClick={()=>{
        deletefile({fileId:file._id})

        toast({
            variant:"default",
            title: "File Deleted",
            description: "U Deleted it ",
          })
      

      }}>Continue</AlertDialogAction>
    </AlertDialogFooter>
  </AlertDialogContent>
</AlertDialog>

         <DropdownMenu>
  <DropdownMenuTrigger> 
    <MoreVertical/>
</DropdownMenuTrigger>
  <DropdownMenuContent>
    <DropdownMenuItem className='flex gap-1 items-center text-yellow-500 cursor:pointer'
    onClick={()=>{
      Favorite({fileId:file._id})


    }}>
    <StarIcon className='h-4 w-4 ' />  
    Favorite
    </DropdownMenuItem>
    <DropdownMenuSeparator/>
    <DropdownMenuItem className='flex gap-1 items-center text-red-500 cursor:pointer'
    onClick={()=>{setconfiremed(true)}}>
    <TrashIcon className='h-4 w-4 ' />  
    Delete
    </DropdownMenuItem>
  </DropdownMenuContent>
</DropdownMenu>
</>
    )

}
