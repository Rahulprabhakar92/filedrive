import React, { useState } from 'react'
import {
    Card,
    CardContent,
    CardDescription,
    CardFooter,
    CardHeader,
    CardTitle,
  } from "@/components/ui/card"

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
  

  
  import { Doc } from '../../../convex/_generated/dataModel'
import { Button } from '../ui/button'
import { DeleteIcon, MoreVertical, TrashIcon } from 'lucide-react'
import { useMutation } from 'convex/react'
import { api } from '../../../convex/_generated/api'
import { toast } from '../ui/use-toast'



function FileCardActions({file}:{file:Doc<'files'>}){
    const [Isconfiremed,setconfiremed]=useState(false)
    const deletefile= useMutation(api.files.deletefile)

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
  

const Filecard = ({file}:{file:Doc<'files'>}) => {
  return (

    <Card>
  <CardHeader className='relative'>
    <CardTitle>{file.name}</CardTitle>
    <div className='absolute top-1 right-1'>
    <FileCardActions file={file}/>
    </div>

  </CardHeader>
  <CardContent>
    <p>Card Content</p>
  </CardContent>
  <CardFooter>
    <Button>Download</Button>
  </CardFooter>
</Card>

  )
}

export default Filecard