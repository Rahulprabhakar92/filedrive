import React, { ReactNode } from 'react'
import {
    Card,
    CardContent,
    CardFooter,
    CardHeader,
    CardTitle,
  } from "@/components/ui/card"  
import { Doc } from '../../../../convex/_generated/dataModel'
import { Button } from '../../../components/ui/button'
import {  FileTextIcon, ImageIcon, GanttChartIcon} from 'lucide-react'
import Image from 'next/image'
import FileCardActions from './file-actions'

export function Filecard({
  file,
}: {
  file: Doc<"files"> & { isFavorited: boolean; url: string | null };
})
{


  const typesIcons={
    'image':<ImageIcon/>, 
    'pdf':<FileTextIcon/>,
    'csv':<GanttChartIcon />,
  }as Record <Doc<"files">['type'],ReactNode>

  return (
    <Card>
  <CardHeader className='relative'>
    <CardTitle className='flex flex-row gap-4 '>
    <p>{typesIcons[file.type]}</p>
    {file.name}
    </CardTitle>
    <div className='absolute top-1 right-1'>
      <FileCardActions favorite={ file.isFavorited} file={file}/>
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
      if (!file.url) return;
      window.open(file.url, "_blank");
    }}>
     Download 
    </Button>
  </CardFooter>
</Card>

  )
}

export default Filecard