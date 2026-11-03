import { IUser } from "../interface/index";
export const blockUser = (user: IUser) => {
  if (user.isBlocked) {
    throw new Error("Your access has been restricted");
  }
};
