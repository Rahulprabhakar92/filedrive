import { MutationCtx, QueryCtx, mutation, query } from "./_generated/server";
import { ConvexError, v } from "convex/values";
import { getUser } from "./users";
import { error } from "console";


async function hasAccestoorg(
  ctx:QueryCtx | MutationCtx,
  tokenIdentifier:string,
  orgId:string
  ) {

  const user=await getUser(ctx,tokenIdentifier)

  const haveacces=user.orgIds.includes(orgId) || user.tokenIdentifier.includes(orgId)

  return haveacces;
}



export const generateUploadUrl = mutation(async (ctx) => {
  const identity=await ctx.auth.getUserIdentity()

  if (!identity) {
    throw new ConvexError("Unauthorized: Please sign in to perform this action.");
  }
  return await ctx.storage.generateUploadUrl();
});


export const createFile=mutation({
  args:{
    name:v.string(),
    fileId: v.id("_storage"),
    orgId:v.string(),
    type:v.union(v.literal("image"),v.literal("csv"),v.literal("pdf")),
  },
  async handler(ctx,args){
    const identity=await ctx.auth.getUserIdentity()

    if (!identity) {
      throw new ConvexError("Unauthorized: Please sign in to perform this action.");
    }

    const hasAcces= await hasAccestoorg(ctx,identity.tokenIdentifier,args.orgId)

    if(!hasAcces) {
      throw new ConvexError("you do not belong to this org")
    }
  
    await ctx.db.insert("files",{
      name:args.name,
      fileId:args.fileId,
      orgId:args.orgId,
      type:args.type,
      url:""
    })
  }
})

export const getFiles = query({
  args: {
    orgId: v.string(),
    query: v.optional(v.string()) // Include query field as optional
  },
  async handler(ctx, args) {
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) {
      return [];
    }
    const hasAccess = await hasAccestoorg(ctx, identity.tokenIdentifier, args.orgId);

    if (!hasAccess) {
      return [];
    }
    let files = await ctx.db
      .query("files")
      .withIndex("by_orgId", (q) => q.eq("orgId", args.orgId))
      .collect();

    const filesWithUrl = await Promise.all(
      files.map(async (file) => ({
        ...file,
        url: await ctx.storage.getUrl(file.fileId),
      }))
    );

    const query = args.query;
    if (query) {
      return filesWithUrl.filter((file) => file.name.includes(query));
    } else {
      return filesWithUrl;
    }
  }
});


export const deletefile=mutation({
  args:{
    fileId:v.id("files")
  },
  async handler(ctx,args){
    const identity=await ctx.auth.getUserIdentity()

    if (!identity) {
      throw new ConvexError("you do not belong to this org")
    }
    const file =  await ctx.db.get(args.fileId)

    if(!file) throw new ConvexError("this file does not exist")

    const hasAcces= await hasAccestoorg(ctx,identity.tokenIdentifier,file.orgId)

    if(!hasAcces)  throw new ConvexError("you do not have assces to delete this file")

    await ctx.db.delete(args.fileId)
    

  }
})

