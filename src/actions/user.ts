"use server"
import connectDB from "@/lib/db"
import {User} from "@/models/userModels"
import { redirect } from "next/navigation"
import { hash } from "bcryptjs"
import { CredentialsSignin } from "next-auth"
import { signIn } from "@/auth"

const LogIn = async (formdata:FormData)=>{
    const email = formdata.get('email') as string 
    const password = formdata.get('password') as string
    console.log(email);
    console.log(password);
    try {
         await signIn("credentials", {
          redirect : false,
          callbackUrl : '/',
          email, 
          password,
       })
    }catch(error) {
        const someerror = error as CredentialsSignin
        return {error : someerror.message }
    }
    redirect("/");
}


const signUpUser  = async (formdata: FormData) => {
    const firstName = formdata.get('firstname') as string
    const lastName = formdata.get('lastname') as string
    const email = formdata.get('email') as string
    const password = formdata.get('password') as string
    console.log(firstName);
    console.log(lastName);
    console.log(email);
    console.log(password);
    try {
    if(!firstName||!lastName||!email||!password ){
        throw new Error("All fields are required")
    }
     try {
        await connectDB()}
        catch(error){
            throw new Error("some thing went wrong")
        }
    const existingUser = await User.findOne({email})
    if(existingUser){
        throw new Error("Email already exists")
    }
    const hashedPassword = await hash(password, 10)  // 10 is the salt rounds, increase it for more secure hashing.
    await User.create({firstName, lastName,email,password:hashedPassword})
    console.log("user created sucessfully")
    }catch(error : any) {
        return {error : error.message}
    }
    redirect('/log-in')
}
export { signUpUser, LogIn }