
import { Button } from "@/components/ui/button"
import { IconBrandGoogle} from "@tabler/icons-react"
import { auth, signIn } from "@/auth"
import LogInForm from "@/components/logInForm"
import { redirect } from "next/navigation"


const LogInPage = async () => {
   const session = await auth()

   const user = session?.user
   if(user) {

      redirect('/')
   }
  return (
    <div className="h-screen grid place-items-center"> 
       <div className="w-[80%] lg:w-[50%] max-w-md bg-[#e8e0d4] text-[#] px-4 py-8">
       <div className="text-center">

          <h2 className="text-2xl font-bold ">DECCAN FURNITURE</h2>
          <p className="text-sm font-normal opacity-70"> please provide all necessary information</p>
       </div>

      <LogInForm />
     <div className="border-t-2 border-[#4d3d30] opacity-40 mt-4">
     </div>
     <form className="mt-8" action = {async()=>{
       "use server"
          await signIn("google",
            { 
               callbackUrl : '/',
            });
     } }>
        <Button className="w-full bg-[#4d3d30]">
            <IconBrandGoogle className=" w-4 mr-4 aspect-square text-md text-[#f5f5dc]"/>
            continue with google
        </Button>
     </form>
     </div>
    </div>

  )
}

export default LogInPage