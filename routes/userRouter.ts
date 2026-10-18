import express from "express";
import {
  accountVerification,
  getAllUsers,
  loginUser,
  logoutUser,
  profilePhotoUser,
  registerUser,
  verifyUserEmail,
  accessTokenExpired,
  editProfileInfo,
  changePassword,
  followUser,
  unFollowUser,
  deleteAccount,
  examScoreRegistration,
  confirmEmail,
  changePasswordWithotLogin,
  confirmVerificationCode,
  paymentJournl,
  checkAndUpdateExpDateJournal,
} from "../controllers/userController";
import { verifyToken } from "../middlewares/token/verifyToken";
import { refreshToken } from "../controllers/refreshToken";
import {
  photoUpload,
  profilePhotoResize,
} from "../middlewares/upload/photoUpload";

const router = express.Router();

//paypal
router.put("/api/v1/users/paymentJournl", verifyToken,paymentJournl);
router.put("/api/v1/users/checkAndUpdateExpDateJournal", verifyToken,checkAndUpdateExpDateJournal);

// NEW TOKEN, CHECK TOKEN
router.get("/api/v1/token", refreshToken);
router.get("/api/v1/check-token", accessTokenExpired);

//LOGIN REGISTER LOGOUT
router.post("/api/v1/register", registerUser);
router.post("/api/v1/login", loginUser);
router.delete("/api/v1/logout", logoutUser);


router.post(
  "/api/v1/generate-verify-email-token",
  verifyToken,
  verifyUserEmail
);
router.put("/api/v1/verify-account",verifyToken, accountVerification);
router.delete("/api/v1/delete-account/:targetUserId", verifyToken, deleteAccount);

router.get("/api/v1/users", getAllUsers);

router.put(
  "/api/v1/users/profile_photo_upload",
  verifyToken,
  photoUpload.single("image"),
  profilePhotoResize,
  profilePhotoUser
);

router.put("/api/v1/users/edit_profile_info", verifyToken, editProfileInfo);

router.put("/api/v1/users/change_password", verifyToken, changePassword);

// Follow And unFollow
router.post("/api/v1/users/follow", verifyToken, followUser);
router.post("/api/v1/users/unfollow", verifyToken, unFollowUser);
router.put("/api/v1/users/examScoreRegistration",verifyToken, examScoreRegistration);



//Forget Password
router.post("/api/v1/users/confirmEmail", confirmEmail);
router.post("/api/v1/users/confirmVerificationCode", confirmVerificationCode);
router.put("/api/v1/users/changePasswordWithotLogin", changePasswordWithotLogin);



export default router;
