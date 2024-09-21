import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import Link from "next/link"
import { signUpUser } from "@/actions/user"
import SignUpForm from "@/components/signUpForm"

const SignUpPage = () => {
  return (
    <div className="h-screen grid place-items-center"> 
       <div className="w-[80%] lg:w-[50%] max-w-md bg-[#e8e0d4] text-[#] px-4 py-8">
       <div className="text-center">

          <h2 className="text-2xl font-bold">DECCAN FURNITURE</h2>
          <p className="text-sm font-normal opacity-70"> please provide all necessary information</p>
       </div>
      
      <SignUpForm />
     </div>
    </div>

  )
}

export default SignUpPage