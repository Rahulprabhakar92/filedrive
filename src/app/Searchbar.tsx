import { zodResolver } from "@hookform/resolvers/zod"

import { z } from "zod"
import { Form,FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from "../components/ui/form"
import { Button } from "../components/ui/button"
import { Loader2 } from "lucide-react"
import { Input } from "../components/ui/input"
import { useForm } from "react-hook-form"
import { Dispatch, SetStateAction } from "react"


const formSchema = z.object({
    query:z.string().min(0).max(300)
   })

export default function Searchbar({query,setquery}:{
  query:string,
  setquery:Dispatch<SetStateAction<string>>}
  ){
    const form = useForm<z.infer<typeof formSchema>>({
        resolver: zodResolver(formSchema),
        defaultValues: {
         query:""
        },
      })
      async function onSubmit(values: z.infer<typeof formSchema>) {
        setquery(values.query)
      } 
    return(
        <div>
      <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className=" flex   gap-4 ">
        <FormField
          control={form.control}
          name="query"
          render={({ field }) => (
            <FormItem>
              <FormControl>
                <Input className="border border-gray-900" placeholder="Your file name" {...field} />
              </FormControl>
              <FormDescription>
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />
        <Button type="submit"
         disabled={form.formState.isSubmitting} 
         className="flex gap-2">
          {form.formState.isSubmitting && (<Loader2 className="animate-spin mr-2 h-4 w-4" />)}
          Submit</Button>
      </form>
    </Form>

        </div>

    )
}