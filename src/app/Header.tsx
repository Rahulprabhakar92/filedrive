import { Button } from "@/components/ui/button";
import {  OrganizationSwitcher, SignInButton, SignOutButton, SignedOut, UserButton, useUser,   } from "@clerk/nextjs";
import { SignedIn } from "@clerk/nextjs";
import Image from "next/image";
import Link from "next/link";


export default function Header(){


    return <div className="border-b py-4 bd-gray-50">
        <div className="container  flex justify-between items-center mx-auto">
            <div className="flex items-center  text-bold text-1xl gap-1">
          <Link href="/">
            <Image 
            src="/logo.png"
            alt="logo"
            height='45'
            width='45'
            />
            </Link>
            FileDrive  
            </div>
            <div className="gap-2 flex">
            <OrganizationSwitcher/>
            <UserButton  />

         
            <SignedIn>
             <SignOutButton>
                <Button>
                    Logout
                </Button>
            </SignOutButton>
            </SignedIn>


            </div>
            </div>
    </div>
}