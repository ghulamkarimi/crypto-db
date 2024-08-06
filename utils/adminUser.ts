import { IUser } from "../interface/index";
export const adminUser = (user:IUser) => {
    if(!user.isAdmin){
         throw new Error("Your access has been restricted")
    }
}