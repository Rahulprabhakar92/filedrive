import { MutationCtx, QueryCtx, internalMutation, mutation, query } from "./_generated/server";
import { ConvexError, v } from "convex/values";
import { getUser } from "./users";
import { error } from "console";
import { Id } from "./_generated/dataModel";
import { internal } from "./_generated/api";
import { fileTypes } from "./schema";


async function hasAccestoorg(
  ctx:QueryCtx | MutationCtx,
  orgId:string
  ) {
    const identity=await ctx.auth.getUserIdentity()

    if (!identity) {
      return null
    }
    const user=await ctx.db.query('users')
    .withIndex('by_tokenIdentifier',q => q.eq('tokenIdentifier',identity.tokenIdentifier))
     .first()

   if(!user) return null

  const haveacces=user.orgIds.includes(orgId) || user.tokenIdentifier.includes(orgId)

  if(!haveacces){
    return null
  }


  return {user} ;
}



export const generateUploadUrl = mutation(async (ctx) => {
  const identity=await ctx.auth.getUserIdentity()

  if (!identity) {
    throw new ConvexError("Unauthorized: Please sign in to perform this action.");
  }
  return await ctx.storage.generateUploadUrl();
});

export const deleteperm=internalMutation({

  async handler(ctx){
    const file=await ctx.db.query('files')
    .withIndex('by_shoulddelete',(q)=>q.eq('shoulddelete',true))
    .collect()

    await Promise.all(( file.map(
      async (file)=>{
      ctx.storage.delete(file.fileId)
      return await ctx.db.delete(file._id)
    })))
  }
})

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

    const hasAcces= await hasAccestoorg(ctx,args.orgId)

    if(!hasAcces) {
      throw new ConvexError("you do not belong to this org")
    }
  
    await ctx.db.insert("files",{
      name:args.name,
      fileId:args.fileId,
      orgId:args.orgId,
      type:args.type,
    })
  }
})

export const getFiles = query({
  args: {
    orgId: v.string(),
    query: v.optional(v.string()), 
    favorites:v.optional(v.boolean()),
    permdelete:v.optional(v.boolean()),
    type:v.optional(fileTypes)
  },
  async handler(ctx, args) {
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) {
      return [];
    }
    const hasAccess = await hasAccestoorg(ctx, args.orgId);

    if (!hasAccess) {
      return [];
    }
    let files = await ctx.db
      .query("files")
      .withIndex("by_orgId", (q) => q.eq("orgId", args.orgId))
      .collect();
      
      const query = args.query;
      if (query) {
        files= files.filter((file) => file.name.toLowerCase().includes(query.toLowerCase()));
      }
    

    if(args.favorites){
      const user=await ctx.db.query('users')
       .withIndex('by_tokenIdentifier',q => q.eq('tokenIdentifier',identity.tokenIdentifier))
        .first()
  
      if(!user) throw new ConvexError("User not Found")

      const favorites = await ctx.db
        .query("favorites")
        .withIndex("by_userId_orgId_fileId", (q) =>
          q.eq("userId", user._id).eq("orgId", args.orgId)
        )
        .collect();

        files = files.filter((file) =>
        favorites.some((favorite) => favorite.fileId === file._id)
        
      );
    }


    if(args.permdelete){
      files=files.filter((file)=>file.shoulddelete)
    }else{
      files=files.filter((file)=>!file.shoulddelete)
    }

    if(args.type){
      files=files.filter((file)=>file.type === args.type)
    }
    
   

    let filesWithUrl = await Promise.all(
      files.map(async (file) => ({
        ...file,
        url: await ctx.storage.getUrl(file.fileId),
      }))
    );
    
   
    return filesWithUrl

  }
});

export const getAllfavs=query({
  args:{orgId:v.string()},

 async handler(ctx,args){
  const hasAcces= await hasAccestoorg(ctx,args.orgId)

  if(!hasAcces)  return null

  const favorites=await ctx.db.query("favorites")
  .withIndex('by_userId_orgId_fileId',(q)=>
  q.eq('userId',hasAcces.user._id).eq('orgId',args.orgId)
  ).collect()


  return favorites
  }
})


export const deletefile=mutation({
  args:{
    fileId:v.id("files")
  },
  async handler(ctx,args){
   
    const file =  await ctx.db.get(args.fileId)

    if(!file) throw new ConvexError("this file does not exist")

    const hasAcces= await hasAccestoorg(ctx,file.orgId)

    if(!hasAcces)  throw new ConvexError("you do not have assces to delete this file")

    // await ctx.db.delete(args.fileId)

    await ctx.db.patch(args.fileId,{
      shoulddelete:true
    })
    

  }
})

export const restorefile=mutation({
  args:{
    fileId:v.id("files")
  },
  async handler(ctx,args){
   
    const file =  await ctx.db.get(args.fileId)

    if(!file) throw new ConvexError("this file does not exist")

    const hasAcces= await hasAccestoorg(ctx,file.orgId)

    if(!hasAcces)  throw new ConvexError("you do not have assces to delete this file")

    // await ctx.db.delete(args.fileId)

    await ctx.db.patch(args.fileId,{
      shoulddelete:false
    })
    

  }
})

export const Favorite=mutation({
  args:{
    fileId:v.id("files")
  },
  async handler(ctx,args){
   
  const file =  await ctx.db.get(args.fileId)

  if(!file) return null

  const hasAcces= await hasAccestoorg(ctx,file.orgId)

  if(!hasAcces)  return null

  const user=await ctx.db.query('users')
       .withIndex('by_tokenIdentifier',q => q.eq('tokenIdentifier',hasAcces.user.tokenIdentifier))
        .first()
  
  if(!user) throw new ConvexError("User not Found")

    const favorite=await ctx.db.query("favorites")
    .withIndex("by_userId_orgId_fileId",q=> 
    q.eq('userId',user._id).eq('orgId',file.orgId).eq('fileId',args.fileId))
    .first()

    if(!favorite){
      await ctx.db.insert('favorites',{
        fileId:file._id,
        userId:user._id,
        orgId:file.orgId
      })
    }else{
      await ctx.db.delete(favorite._id)

    }
  }
})

async function hasAccestofile
(ctx:QueryCtx | MutationCtx ,
  fileId:Id<'files'>)
{
 
  const file =  await ctx.db.get(fileId)

  if(!file) return null

  const hasAcces= await hasAccestoorg(ctx,file.orgId)

  if(!hasAcces)  return null
  const user=await ctx.db.query('users')
       .withIndex('by_tokenIdentifier',q => q.eq('tokenIdentifier',hasAcces.user._id))
        .first()
  
  if(!user) throw new ConvexError("User not Found")

  return {user,file}

}