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
import { DeleteIcon, FileTextIcon, ImageIcon, MoreVertical, TrashIcon,GanttChartIcon, FileDiff, StarIcon, StarHalf, StarHalfIcon, FileHeart, FileIcon, ArchiveRestoreIcon } from 'lucide-react'
import { useMutation,  useQuery } from 'convex/react'
import { api } from '../../../../convex/_generated/api'
import { toast } from '../../../components/ui/use-toast'
import { Protect } from '@clerk/nextjs'



export default function FileCardActions({file,favorite}:{file: Doc<"files"> & { url: string | null },favorite:boolean} ){
    const [Isconfiremed,setconfiremed]=useState(false)
    const deletefile= useMutation(api.files.deletefile)
    const restorefile=useMutation(api.files.restorefile)
    const Favorite=useMutation(api.files.Favorite)


    return(

        <>
<AlertDialog open={Isconfiremed} onOpenChange={setconfiremed}>
  <AlertDialogContent>
    <AlertDialogHeader>
      <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
    </AlertDialogHeader>
    <AlertDialogFooter>
      <AlertDialogCancel>Cancel</AlertDialogCancel>
      <AlertDialogAction onClick={()=>{
        if(file.shoulddelete){
          restorefile({fileId:file._id})

          toast({
            variant:"default",
            title: "Restoring file",
            description: "Your file will be restored",
          })

        }else{
          deletefile({fileId:file._id})

          toast({
              variant:"default",
              title: "File Marked for deletion",
              description: "Ur file will be deleted soon ",
            })
        }
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
    {favorite ? 
    <div className='flex gap-2'>
        < FileIcon className='w-4 h-4'/>
        UnFavorite
        </div>

      :<div className='flex gap-2'>
    
      <FileHeart className='w-4 h-4' />
      favorite
      </div>
      }
  

    </DropdownMenuItem>

    {/* <Protect
      permission="org:admin"
      fallback={<p></p>}
    >   */}
    {file.shoulddelete  ?   
    <DropdownMenuItem className='flex gap-1 items-center text-green-500 cursor:pointer'
    onClick={()=>{
     
        setconfiremed(true)
 
      }}>
        <ArchiveRestoreIcon className='h-4 w-4 ' />  
            Restore
    </DropdownMenuItem>
    :
    <DropdownMenuItem className='flex gap-1 items-center text-red-500 cursor:pointer'
    onClick={()=>{setconfiremed(true)}}>
        <TrashIcon className='h-4 w-4 ' />  
            Delete
    </DropdownMenuItem>}
    {/* </Protect> */}
  </DropdownMenuContent>
</DropdownMenu>
</>
    )
}
