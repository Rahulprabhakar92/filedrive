import React, { ReactNode, useState } from 'react'
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
  

  
  import { Doc, Id } from '../../../convex/_generated/dataModel'
import { Button } from '../ui/button'
import { DeleteIcon, FileTextIcon, ImageIcon, MoreVertical, TrashIcon,GanttChartIcon, FileDiff } from 'lucide-react'
import { useMutation,  useQuery } from 'convex/react'
import { api } from '../../../convex/_generated/api'
import { toast } from '../ui/use-toast'
import Image from 'next/image'
import { getURL } from 'next/dist/shared/lib/utils'
import FileCardActions from './file-actions'






const Filecard = ({file}:{file:Doc<'files'>} & { url : string | null}) => {

  const typesIcons={
    'image':<ImageIcon/>,
    'pdf':<FileTextIcon/>,
    'csv':<GanttChartIcon />,
  }as Record <Doc<"files">['type'],ReactNode>

  const imageUrl = file.type === "image" && URL ? URL : '';
  
  
  
  return (


    <Card>
  <CardHeader className='relative'>
    <CardTitle className='flex flex-row gap-4 '>
    <p>{typesIcons[file.type]}</p>
    {file.name}
    </CardTitle>
    <div className='absolute top-1 right-1'>
      <FileCardActions  file={file}/>
    </div>

  </CardHeader>
  <CardContent className='h-[200px]  flex justify-center items-center '>

      {file.type === "image" && file.url && (
        <Image alt={file.name} width="200" height="100" src={file.url} />
      )}
      
    {file.type === 'pdf' && (
      <FileTextIcon className='h-20 w-20'/>
    )}
    {file.type === 'csv' && (
      <GanttChartIcon  className=' w-20 h-20'/>
    )}
  </CardContent>
  <CardFooter className='flex items-center justify-center'>
    <Button onClick={()=>{
      if(!file.url) return;
      window.open(file.url,"_blank")
    }}>
     Download 
    </Button>
  </CardFooter>
</Card>

  )
}

export default Filecard