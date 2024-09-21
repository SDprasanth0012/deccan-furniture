"use client"
import { Label } from "./ui/label"
import { Input } from "./ui/input"
import { Button } from "./ui/button"
import Link from "next/link"
import { signUpUser } from "@/actions/user"
import { useState } from "react"


const SignUpForm = () => {
    const [error, setError ] =  useState("")
    const clientAction = async (formdata:FormData) => {
        const result = await signUpUser(formdata);
        if(result?.error ) {
         setError(result.error)
         }
    }
  return (
    <div>
        <div className="h-8 mt-4 flex flex-col justify-end">

        {error && <p className="text-red-700 text-sm text-center mb-2">*{error}</p>}
        </div>
        <form className="flex flex-col gap-4 " action ={clientAction}>
    <div className="flex gap-4 w-[100%] justify-between">
          <div>
          <Label>First Name </Label>
          <Input 
             id="first name" 
             placeholder="rama" 
             type="text" 
             name="firstname"/>
          </div>
          <div className="">

          <Label>last Name </Label>
          <Input id="last name" placeholder="rao" type="text" name="lastname"/>
          </div>
    </div>
    <div>

  <Label> Email id </Label>
  <Input 
     id="email" 
     placeholder="name@gmail.com" 
     type="email" 
     name="email"/>
     </div>
     <div>

  <Label> Password </Label>
  <Input 
     id="password" 
     placeholder="******" 
     type="password" 
     name="password"/>
     </div>
     <div className="mt-8">
      <Button className="w-full"> Sign Up</Button>
      <p className="text-center mt-2 text-sm"> Already have an account? <Link href="/log-in"><b>
        log In
        </b>
        </Link></p>
     </div>
  </form></div>
  )
}

export default SignUpForm