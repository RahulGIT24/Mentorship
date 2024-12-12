export interface IUser {
    _id: string;
    name: string;
    username: string;
    createdAt: string;
    updatedAt?: string;
    email:string
    verificationStatus:boolean
  }