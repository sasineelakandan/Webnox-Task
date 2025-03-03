import { UserSignupInput, UserSignupOutput,UserProfileOutput,SuccessResponse,PostDatas, CommentDatas } from "./userService.types";

export interface IUserService {
  userSignup(userData: UserSignupInput): Promise<UserSignupOutput>;
  userProfile(userId:string):Promise<UserProfileOutput>
  userLogin(email: string, password: string): Promise<UserSignupOutput>;
  updateProfilePic(userId:string,profilePic:string):Promise<SuccessResponse>
   addPost(userId:string,data:any):Promise<SuccessResponse>
   getPost():Promise<PostDatas>
   addLike(userId:string,postId:string):Promise<SuccessResponse>
   addComment(userId:string,data:any):Promise<SuccessResponse>
   getComments(userId:string,postId:any):Promise<CommentDatas>
}
