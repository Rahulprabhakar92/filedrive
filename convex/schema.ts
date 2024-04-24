import { defineSchema, defineTable } from "convex/server";
import { v } from "convex/values";

export default defineSchema({
  files: defineTable({ 
    name: v.string() ,
    type:v.union(v.literal("image"),v.literal("csv"),v.literal("pdf")),
    orgId:v.string(), 
    fileId:v.id("_storage"),
    url:v.string()
  })
  .index("by_orgId",['orgId']),
  
  users:defineTable({
    tokenIdentifier :v.string(),
    orgIds:v.array(v.string()),
  }).index("by_tokenIdentifier",["tokenIdentifier"])
});