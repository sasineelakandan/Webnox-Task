import { Request } from "express";
import { ControllerResponse } from "./userController.types";

export interface IUserController {
  userSignup(httpRequest: Request): Promise<ControllerResponse>;
  userProfile(httpRequest:Request):Promise<ControllerResponse>
  updateProfilepic(httpRequest:Request):Promise<ControllerResponse>
  addPost(httpRequest:Request):Promise<ControllerResponse>
  getPost(httpRequest:Request):Promise<ControllerResponse>
  addLike(httpRequest:Request):Promise<ControllerResponse>
  addComment(httpRequest:Request):Promise<ControllerResponse>
  getComments(httpRequest:Request):Promise<ControllerResponse>
}
