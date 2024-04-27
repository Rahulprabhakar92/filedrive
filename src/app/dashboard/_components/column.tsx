"use client"


import { Doc } from "../../../../convex/_generated/dataModel"
import { formatRelative } from 'date-fns';
import FileCardActions from "./file-actions";
import { ColumnDef } from "@tanstack/react-table";

export const columns: ColumnDef<Doc<"files"> & { isFavorited: boolean }>[] = [
  {
    accessorKey: "name",
    header: "Name",
  },

  {
    accessorKey: "type",
    header: "Type",
  },

  {
    accessorKey: "Upload time",
    cell: ({ row }) => {
      const time = parseFloat(row.getValue("createdOn"))
 
      return <div>{formatRelative(new Date(row.original._creationTime),new Date())}</div>
    },
  },
  {
    accessorKey: "Action time",
    cell: ({ row }) => {
 
      return <div>
        <FileCardActions 
       file={row.original}
       favorite={false}
        />
        </div>
    },
  }
]
