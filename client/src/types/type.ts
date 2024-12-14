export interface IUser {
    _id: string;
    name: string;
    username: string;
    createdAt: string;
    updatedAt?: string;
    email:string
    verificationStatus:boolean,
    role:string
    skills:string[],
    interest:string[],
    bio: string,
    profileImage?:string
  }
export interface IFilter{
  skills?:string[],
  interest?:string[],
  role?:string,
  search?:string
}