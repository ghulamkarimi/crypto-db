export interface IUser {
  userId: string;
  firstName: string;
  lastName: string;
  gender: string;
  email: string;
  password: string;
  bio: string;
  profile_photo: string;
  canAnalyze: boolean;
  correctAnswers: number;
  incorrectAnswers: number;
  totalScore: number;
  isBlocked: boolean;
  isAdmin: boolean;
  isFollowing: boolean;
  isAccountVerified: boolean;
  viewedBy: [];
  followers: [];
  following: [];
  access_token: string;
  randomVerifyAccountToken: string;
  isPasswordMatched: Function;
  createAccountVerificationToken: Function;
  accountVerificationToken: string;
  accountVerificationTokenExpires: Date;
  verificationCode: string;
  isPaid: boolean;
  planJournal: number;
  priceJournal: string;
  journal_token: string;
  expJournal: Date;
  iatJournal: Date;
}

export interface ICoin {
  _id: string;
  id: string;
  symbol: string;
  name: string;
  image: string;
  current_price: number;
  market_cap: number;
  market_cap_rank: number;
  fully_diluted_valuation: number;
  total_volume: number;
  high_24h: number;
  low_24h: number;
  price_change_24h: number;
  price_change_percentage_24h: number;
  market_cap_change_24h: number;
  market_cap_change_percentage_24h: number;
  circulating_supply: number;
  total_supply: number;
  max_supply: number;
  ath: number;
  ath_change_percentage: number;
  ath_date: Date;
  atl: number;
  atl_date: number;
  atl_change_percentage: Date;
  roi: object;
  last_updated: Date;
  sparkline_in_7d: {
    price: number[];
  };
  price_change_percentage_1h_in_currency: number;
  price_change_percentage_24h_in_currency: number;
  price_change_percentage_7d_in_currency: number;
}

export interface IPost {
  _id: string;
  file: File;
  title: string;
  description: string;
  isLiked: boolean;
  isDisliked: boolean;
  numViews: number;
  likes: [];
  disLikes: [];
  user: string;
  image: string;
  updatedAt: string;
}

export interface IQuestion {
  _id: string;
  type: "trueFalse" | "singlecorrect_answers" | "multiplecorrect_answers";
  question: string;
  choices: string;
  correct_answers: string;
  score: number;
}

export interface IJournal {
  _id: string;
  user: string;
  baseCoin: string;
  quoteCoin: string;
  tradeType: string;
  startTime: string;
  endTime: string;
  startDate: string;
  endDate: string;
  price: number;
  takeProfit: number;
  stopLoss: number;
  riskReward: number;
  reasonsforEntry: string;
  isClose: boolean;
  tradeSummary: string;
}
