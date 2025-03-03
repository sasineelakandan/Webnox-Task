export type UserSignupInput = {
  username: string;
  email: string;
  phone: string;
  password: string;
  age: string;
  address: string;
  gender?: string;
};

export type UserSignupOutput = {
  readonly _id: string;
  readonly username: string;
  readonly email: string;
  readonly phone: string;
  readonly age: string;
  readonly address: string;
  readonly gender?: string;
  readonly createdAt: Date;
  readonly updatedAt: Date;
  readonly accessToken: string;
  readonly refreshToken: string;
};


export type UserProfileOutput = {
  readonly _id: string;
  readonly username: string;
  readonly email: string;
  readonly phone: string;
  readonly age: string;
  readonly profilePic:string;
  readonly address: string;
  readonly gender?: string;
  readonly createdAt: Date;
  readonly updatedAt: Date;
  
};

export type SuccessResponse ={
  status: string;       
  message: string;      
               
  }

  export type PostDatas= Array<{ [key: string]: any }>

  export type CommentDatas= Array<{ [key: string]: any }>