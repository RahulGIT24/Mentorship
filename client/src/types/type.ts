export interface IUser {
  _id: string;
  name: string;
  username: string;
  createdAt: string;
  updatedAt?: string;
  email: string
  verificationStatus: boolean,
  role: string
  skills: string[],
  interest: string[],
  bio: string,
  profileImage?: string
  unreadNotifications?: number
}
export interface IFilter {
  skills?: string[],
  interest?: string[],
  role?: string,
  search?: string
}

export interface INotification {
  sender: string,
  receiver: string,
  subject: string,
  description: string,
  isRead: boolean
  _id: string,
  connectionRequest: boolean
}

export interface IMatch {
  preference:string
}