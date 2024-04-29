"use client";

import { ColumnDef } from "@tanstack/react-table";
import { Doc, Id } from "../../../../convex/_generated/dataModel";
import { formatRelative } from "date-fns";

import FileCardActions from "./file-actions";
 






export const columns: ColumnDef<{
  isFavorited: boolean;
  url: string | null;
  _id: Id<"files">;
  _creationTime: number;
  shoulddelete?: boolean;
  type: "image" | "csv" | "pdf";
  name: string;
  orgId: string;
  fileId: Id<"_storage">;
}>[] = [
  {
    accessorKey: "name",
    header: "Name",
  },
  {
    accessorKey: "type",
    header: "Type",
  },
  {
    header: "Uploaded On",
    cell: ({ row }) => {
      return (
        <div>
          {formatRelative(new Date(row.original._creationTime), new Date())}
        </div>
      );
    },
  },
  {
    header: "Actions",
    cell: ({ row }) => {
      return (
        <div>
          <FileCardActions
            file={row.original}
            favorite={row.original.isFavorited}
          />
        </div>
      );
    },
  },
];