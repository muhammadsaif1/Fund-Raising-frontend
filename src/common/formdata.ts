// user interface
export interface UserFormData {
  _id?: string;
  name?: string;
  email?: string;
  password?: string;
  role?: "user" | "organization" | "admin";
  proofImage?: string;
  accountDetails?: {
    accountNumber?: string;
    accountTitle?: string;
    bankName?: string;
  };
  createdAt?: Date;
  updatedAt?: Date;
  description?: string;
  isVerified?: boolean;
  verificationDate?: Date;
}

// Post interface
export interface PostFormData {
  _id?: string;
  userId?: string;
  title?: string;
  description?: string;
  likes?: number[];
  comments?: Comment[];
  createdAt?: Date;
  createdBy?: UserFormData;
  image?: string;
}

// Comment interface
export interface CommentFormData {
  _id?: string;
  post?: PostFormData;
  user?: UserFormData;
  text?: string;
  createdAt?: Date;
  updatedAt?: Date;
}
