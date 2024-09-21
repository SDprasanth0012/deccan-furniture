"use client"

import { Button } from "./ui/button"
import { Input } from "./ui/input"
import { Label } from "./ui/label"
import Link from "next/link"
import { LogIn } from "@/actions/user"
import { useState } from "react"
import { CredentialsSignin } from "next-auth"

const LogInForm = () => {
    const [error , setError] = useState('')
    const clientAction = async (formdata:FormData) => {
        const result = await LogIn(formdata);
        if(result.error ) {
          const cleanedError = result.error
          .replace(/Read more at https:\/\/errors\.authjs\.dev#credentialssignin$/, '')
          .trim();
           setError(cleanedError);
         }
    }
  return (
    <div>
         <form className="flex flex-col gap-4 mt-2" action={clientAction} >
          <div className="h-[12px]">

         {error && <div className="text-red-700 text-sm">{ error}</div>}
          </div>
       
      <div>
  
        <Label htmlFor="email"> Email id </Label>
        <Input 
           id="email" 
           placeholder="name@gmail.com" 
           type="email" 
           name="email"/>
           </div>
           <div>
  
        <Label htmlFor="password"> Password </Label>
        <Input 
           id="password" 
           placeholder="******" 
           type="password" 
           name="password"/>
           </div>
           <div className="mt-8">
            <Button className="w-full"> Log In</Button>
            <p className="text-center mt-2 text-sm"> don't have an account? <Link href="/sign-up"> <b>
              sign up
              </b>
              </Link></p>
           </div>
        </form>
    </div>
  )
}

export default LogInForm