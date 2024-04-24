import { Button } from "@/components/ui/button";
import {  OrganizationSwitcher, SignInButton, UserButton } from "@clerk/nextjs";

export default function Header(){
    return <div className="border-b py-4 bd-gray-50">
        <div className="container  flex justify-between items-center mx-auto">
            FileDrive  
            <div className="gap-2 flex">
            <OrganizationSwitcher/>
            <UserButton/>
            <SignInButton>
                <Button>
                    Sign-in
                </Button>
            </SignInButton>
            </div>
            </div>
    </div>
}