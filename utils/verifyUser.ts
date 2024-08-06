import { IUser } from "../interface/index";
export const verifyUser = (user:IUser) => {
    if(!user.isAccountVerified){
         throw new Error("You must first verify your account.")
    }
}