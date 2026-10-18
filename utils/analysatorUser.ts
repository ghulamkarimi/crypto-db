import { IUser } from "../interface/index";
export const analysatorUser = (user: IUser) => {
  if (!user.canAnalyze) {
    throw new Error("Your access has been restricted");
  }
};