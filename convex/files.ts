import { MutationCtx, QueryCtx, mutation, query } from "./_generated/server";
import { ConvexError, v } from "convex/values";
import { getUser } from "./users";


async function hasAccestoorg(
  ctx:QueryCtx | MutationCtx,
  tokenIdentifier:string,
  orgId:string
  ) {

  const user=await getUser(ctx,tokenIdentifier)

  const haveacces=user.orgIds.includes(orgId) || user.tokenIdentifier.includes(orgId)

  return haveacces;
}

export const createFile=mutation({
  args:{
    name:v.string(),
    orgId:v.string()
  },
  async handler(ctx,args){
    const identity=await ctx.auth.getUserIdentity()

    if (!identity) {
      throw new ConvexError("Unauthorized: Please sign in to perform this action.");
    }

    // console.log(hasAcces,"dsf")

    // const user=await getUser(ctx,identity.tokenIdentifier)

    // const hasAcces=user.orgIds.includes(args.orgId) ||
    // user.tokenIdentifier.includes(args.orgId)

    const hasAcces= await hasAccestoorg(ctx,identity.tokenIdentifier,args.orgId)

    if(!hasAcces) {
      throw new ConvexError("you do not belong to this org")
    }

   

  
    await ctx.db.insert("files",{
      name:args.name,
      orgId:args.orgId
    })
  }
})

export const getFiles=query({
  args:{
    orgId:v.string(),
  },
  async handler(ctx,args){
    const identity=await ctx.auth.getUserIdentity()
    if (!identity) {
      return[]
    }
    const hasAcces= await hasAccestoorg(ctx,identity.tokenIdentifier,args.orgId)

    if(!hasAcces) {
     return []
    }
    

    return ctx.db.query('files').withIndex('by_orgId',(q)=>
      q.eq('orgId',args.orgId)
    ).collect()
  }
})