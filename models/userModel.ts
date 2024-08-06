import mongoose from "mongoose";
import bcrypt from "bcrypt";
import { IUser } from "../interface";

const userSchema = new mongoose.Schema<IUser>(
  {
    firstName: {
      type: String,
    },
    lastName: {
      type: String,
    },
    gender: {
      type: String,
    },
    email: {
      type: String,
    },
    password: {
      type: String,
    },
    bio: {
      type: String,
    },
    profile_photo: {
      type: String,
      default: "",
    },
    canAnalyze: {
      type: Boolean,
      default: false,
    },
    correctAnswers: {
      type: Number,
      default:0
    },
    incorrectAnswers: {
      type: Number,
      default:0
    },
    totalScore: {
      type: Number,
      default:0
    },
    isBlocked: {
      type: Boolean,
      default: false,
    },
    isAdmin: {
      type: Boolean,
      default: false,
    },
    isFollowing: {
      type: Boolean,
      default: false,
    },
    isAccountVerified: {
      type: Boolean,
      default: false,
    },
    isPaid:{
      type: Boolean,
      default: false,
    },
    planJournal:{
      type:Number,
    },
    priceJournal:{
      type:String,
    },
    expJournal:{
      type:Date,
    },
    iatJournal:{
      type:Date,
    },
    journal_token:{
      type:String,
    },
    accountVerificationToken: String,
    accountVerificationTokenExpires: Date,
    viewedBy: {
      type: [
        {
          type: mongoose.Schema.Types.ObjectId,
          ref: "User",
        },
      ],
    },
    followers: {
      type: [
        {
          type: mongoose.Schema.Types.ObjectId,
          ref: "User",
        },
      ],
    },
    following: {
      type: [
        {
          type: mongoose.Schema.Types.ObjectId,
          ref: "User",
        },
      ],
    },
    access_token: {
      type: String,
    },
    verificationCode:{
      type:String
    }
  },
  {
    toJSON: {
      virtuals: true,
    },
    toObject: {
      virtuals: true,
    },
    timestamps: true,
  }
);

userSchema.pre("save", async function (next) {
  if (this.isModified("password") || this.isNew) {
    const salt = await bcrypt.genSalt(10);
    this.password = await bcrypt.hash(this.password, salt);
    next();
  }
  if (!this.profile_photo) {
    switch (this.gender) {
      case "male":
        this.profile_photo =
          "https://cdn-icons-png.freepik.com/512/610/610120.png";
        break;
      case "female":
        this.profile_photo =
          "https://assets.stickpng.com/images/585e4bc4cb11b227491c3395.png";
        break;
      case "diverse":
        this.profile_photo =
          "https://images.freeimages.com/fic/images/icons/747/network/256/user_group.png";
        break;
    }
  }
});

userSchema.methods.isPasswordMatched = async function (
  enteredPassword: string
) {
  return await bcrypt.compare(enteredPassword, this.password);
};

// userSchema.methods.createAccountVerificationToken = async function () {
//   const verificationToken = crypto.randomBytes(32).toString("hex");
//   this.accountVerificationToken = crypto
//     .createHash("sha256")
//     .update(verificationToken)
//     .digest("hex");
//   this.accountVerificationTokenExpires = Date.now() + 30 * 60 * 1000;
//   return verificationToken;
// };

const Users = mongoose.model("User", userSchema);
export default Users;
