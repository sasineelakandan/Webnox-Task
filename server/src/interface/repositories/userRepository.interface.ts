import { AddUserInput, AddUserOuput, GetUserOutput ,GetuserProfileOutput,SuccessResponse,PostDatas} from "./userRepository.types";

export interface IUserRepository {
  addUser(userData: AddUserInput): Promise<AddUserOuput>;
  getUserByEmail(email: string) : Promise<GetUserOutput>;
  userProfile(userId:string):Promise<GetuserProfileOutput>
  updateProfilePic(userId:string,profilePic:string):Promise<SuccessResponse>
  addPost(userId:string,data:any):Promise<SuccessResponse>
  getPost():Promise<PostDatas>
  addLike(userId:string,postId:string):Promise<SuccessResponse>
  addComment(userId:string,data:any):Promise<SuccessResponse>
}
