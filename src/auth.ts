import NextAuth, { CredentialsSignin } from "next-auth"
import Credentials from "next-auth/providers/credentials"
import connectDB from "./lib/db"
import { User } from "./models/userModels"
import { compare } from "bcryptjs"
import Google from "next-auth/providers/google"

export const { handlers, signIn, signOut, auth } = NextAuth({
  providers: [
    Google({
      clientId : process.env.GOOGLE_CLIENT_ID,
      clientSecret : process.env.GOOGLE_CLIENT_SECRET,
    }),

    Credentials({

      name: "credentials",

      credentials : {
        email: { label: "Email", type: "email", placeholder: "Enter your email" },
        password: { label: "Password", type: "password", placeholder: "Enter your password" },
      },

      authorize : async( credentials )=> {
         const email = credentials.email as string | undefined
         const password = credentials.password as string | undefined
        
         
         if(!email||!password){
            throw new CredentialsSignin("Please provide both email and password")
         }
          try {
            await connectDB()
          }catch (error){
            throw new CredentialsSignin("some thing went wrong")
          }
         
         const user = await  User.findOne({email}).select("+password")
         if(!user) throw new CredentialsSignin("invalid email or password")

         if(!user.password) throw new CredentialsSignin("please provide password")
         const isMatched = await compare(password, user.password);
         if(!isMatched) throw new CredentialsSignin("incorrect password")
         
         const userData = {
            name : user.firstName + " " + user.lastName,
            email : user.email,
            role : user.role,
            id : user._id
        }
        return userData;
     
      },
    }),
  ],
  pages:{
    signIn: "/log-in",
  },
  callbacks: {
    async session({session, token}) {
     if(token?.sub && token.role ){
        session.user.id = token.sub;
        session.user.name = token.name || "prasanth";
        session.user.role = token.role as string;
     }
     return session;
    },
    async jwt ({token, user, account}){

      if(user){
        if (account?.provider === "google") {
          await connectDB();
          const dbUser = await User.findOne({ email: user.email });
          token.role = dbUser?.role || "user"; // Assign role from DB or default to 'user'
          token.sub = dbUser._id
        } else {
          token.role = user.role
        }
    
      }

      return token;
    },
    signIn : async ({user, account}) => {

      if(account?.provider === "google"){
        try {
          const {email, name, image, id}  = user;
          console.log("Connecting to DB...");
          await connectDB()
          const alreadyUser = await User.findOne({email})
          console.log("already user is ", alreadyUser)
          if(!alreadyUser) {
            await User.create({email, firstName:name, role:"user", image, authProviderId : id}) 
            console.log("User created")
            return true;
          }else {
            console.log("User already in signIn", alreadyUser)
            return true;
          }
        }catch(error:any) {
          console.log("Error occurred while connecting to DB:", error)
          throw new Error("something went wrong AT GOOGLE", error)
        }
      }
      if(account?.provider === "credentials") return true;
       return false;
    },
  }
})