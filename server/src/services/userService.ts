import { IUserRepository } from "../interface/repositories/userRepository.interface";
import { IUserService } from "../interface/services/userService.interface";
import {
  CommentDatas,
  PostDatas,
  SuccessResponse,
  UserProfileOutput,
  UserSignupInput,
  UserSignupOutput,
} from "../interface/services/userService.types";

import { comparePassword, encryptPassword } from "../utils/encryption";
import { AppError } from "../utils/errors";
import {
  generateAccessToken,
  generateRefreshToken,
} from "../utils/generateJWT";

export class UserService implements IUserService {
  private userRepository: IUserRepository;

  constructor(userRepository: IUserRepository) {
    this.userRepository = userRepository;
  }

  userSignup = async (userData: UserSignupInput): Promise<UserSignupOutput> => {
    try {
      const encryptedPassword = encryptPassword(userData.password);

      const user = await this.userRepository.addUser({
        ...userData,
        password: encryptedPassword,
      });

      const accessToken = generateAccessToken(user._id, "user");
      const refreshToken = generateRefreshToken(user._id, "user");

      return { ...user, accessToken, refreshToken };
    } catch (error: any) {
      console.log("Error in user service", error.message);
      throw new Error(error.message);
    }
  };

  userLogin = async (
    email: string,
    password: string
  ): Promise<UserSignupOutput> => {
    try {
      const user = await this.userRepository.getUserByEmail(email);

      const isValidPassword = comparePassword(password, user.password);
      if (!isValidPassword) throw new AppError("Invalid Credentials", 401);

      const accessToken = generateAccessToken(user._id, "user");
      const refreshToken = generateRefreshToken(user._id, "user");

      return {
        _id: user._id,
        username: user.username,
        email: user.email,
        phone: user.phone,
        age: user.age,
        address: user.address,
        gender: user.gender,
        createdAt: user.createdAt,
        updatedAt: user.updatedAt,
        accessToken,
        refreshToken,
      };
    } catch (error: any) {
      console.log("Error in user service", error.message);
      throw new Error(error.message);
    }
  };
  userProfile = async (userId: string): Promise<UserProfileOutput> => {
    try {
      const user = await this.userRepository.userProfile(userId);
  
      if (!user) {
        throw new Error("User not found");
      }
  
      return {
        _id: user._id,
        username: user.username,
        email: user.email,
        phone: user.phone,
        age: user.age,
        gender: user.gender,
        profilePic:user.profilePic,
        address: user.address, // Removed optional chaining
        createdAt: user.createdAt,
        updatedAt: user.updatedAt,
      };
    } catch (error: any) {
      console.log("Error in userProfile", error.message);
      throw new Error(error.message);
    }
  };
updateProfilePic=async(userId: string, profilePic: string): Promise<SuccessResponse> =>{
  

    try {
      const appointments = await this.userRepository.updateProfilePic(
        userId,
        profilePic
      );
      return appointments;
    } catch (error: any) {
      console.log("Error in updateProfile", error.message);
      throw new Error(error.message);
    }
   }
addPost=async(userId: string, data: any): Promise<any> =>{
  try {
    const response = await this.userRepository.addPost(
      userId,
      data
    );
    return response;
  } catch (error: any) {
    console.log("Error in addPost", error.message);
    throw new Error(error.message);
  }
}

getPost=async(): Promise<PostDatas>  =>{
  try {
    const response = await this.userRepository.getPost(
     
    );
    return response;
  } catch (error: any) {
    console.log("Error in getPost", error.message);
    throw new Error(error.message);
  }
}

addLike=async(userId: string, postId: string): Promise<any> =>{
  try {
    const response = await this.userRepository.addLike(
     userId,
     postId
    );
    return response;
  } catch (error: any) {
    console.log("Error in getPost", error.message);
    throw new Error(error.message);
  }
}

addComment=async(userId: string, data: any): Promise<any>=> {
  try {
    const response = await this.userRepository.addComment(
      userId,
      data
    );
    return response;
  } catch (error: any) {
    console.log("Error in addPost", error.message);
    throw new Error(error.message);
  }
}

getComments=async(userId: string, postId: any): Promise<CommentDatas>=> {
  try {
    const response = await this.userRepository.getComments(
      userId,
      postId
    );
    return response;
  } catch (error: any) {
    console.log("Error in addPost", error.message);
    throw new Error(error.message);
  }
}
  
}
