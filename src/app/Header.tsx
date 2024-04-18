import {  OrganizationSwitcher, UserButton } from "@clerk/nextjs";

export default function Header(){
    return <div className="border-b py-4 bd-gray-50">
        <div className="container  flex justify-between items-center mx-auto">
            FileDrive  
            <div className="gap-2 flex">
            <OrganizationSwitcher/>
            <UserButton/>
            </div>
           
            </div>

    </div>
}