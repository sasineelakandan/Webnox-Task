import { Request } from "express";
import { IUserController } from "../interface/controllers/userController.interface";
import { ControllerResponse } from "../interface/controllers/userController.types";
import { IUserService } from "../interface/services/userService.interface";
import { CustomRequest } from "../middlewares/validators/jwt/authentication";
export class UserController implements IUserController {
  private userService: IUserService;

  constructor(userService: IUserService) {
    this.userService = userService;
  }

  userSignup = async (httpRequest: Request): Promise<ControllerResponse> => {
    try {
      const { username, email, phone, password, age, address, gender } =
        httpRequest.body;

      const user = await this.userService.userSignup({
        username,
        email,
        phone,
        password,
        age,
        address,
        gender,
      });
      const { accessToken, refreshToken } = user;

      return {
        headers: {
          "Content-Type": "application/json",
        },
        statusCode: 201,
        body: user,
        accessToken,
        refreshToken,
      };
    } catch (e: any) {
      console.log(e);
      return {
        headers: {
          "Content-Type": "application/json",
        },
        statusCode: e.statusCode || 500,
        body: {
          error: e.message,
        },
      };
    }
  };

  userLogin = async (httpRequest: Request): Promise<ControllerResponse> => {
    try {
      const { email, password } = httpRequest.body;

      const user = await this.userService.userLogin(email, password);
      const { accessToken, refreshToken } = user;

      return {
        headers: {
          "Content-Type": "application/json",
        },
        statusCode: 200,
        body: user,
        accessToken,
        refreshToken,
      };
    } catch (e: any) {
      console.log(e);
      return {
        headers: {
          "Content-Type": "application/json",
        },
        statusCode: e.statusCode || 500,
        body: {
          error: e.message,
        },
      };
    }
  };
  userProfile = async (httpRequest: CustomRequest): Promise<ControllerResponse> => {
    try {
      console.log(httpRequest)
      const userId = httpRequest?.user?.id;
      console.log(userId)
    
      if (!userId) {
        console.error('User ID not found');
        throw new Error('User ID is required to fetch the profile.');
      }
  
      
      const user = await this.userService.userProfile( userId);
      
      return {
        headers: {
          "Content-Type": "application/json",
        },
        statusCode: 201, 
        body: { ...user },
      };
    } catch (error: any) {
      console.error('Error in userProfile:', error.message);
  
      
      return {
        headers: {
          "Content-Type": "application/json",
        },
        statusCode: 500, 
        body: { error: error.message || 'An unknown error occurred.' },
      };
    }
  }
  
  updateProfilepic = async (httpRequest: CustomRequest): Promise<ControllerResponse> => {
    try {
      // Check if the file is provided
      if (!httpRequest.file) {
        return {
          headers: { "Content-Type": "application/json" },
          statusCode: 400, // Bad Request
          body: { error: "Profile picture is required." },
        };
      }
  
      // Extract user ID
      const userId = httpRequest?.user?.id;
      if (!userId) {
        throw new Error("User ID is missing.");
      }
      
      // Construct the correct file path
      const filePath:any = httpRequest.file.path // Use filename instead of originalname
  
      console.log(`Updating profile picture for user: ${userId}, File Path: ${filePath}`);
  
      // Call the service method to update the profile picture in the database
      const updatedProfile = await this.userService.updateProfilePic(userId, filePath);
  
      return {
        headers: { "Content-Type": "application/json" },
        statusCode: 201, // Created
        body: {
          message: "Profile picture updated successfully.",
          filePath, // Return file path for reference
          updatedProfile, // Optional: Return updated user data
        },
      };
    } catch (error: any) {
      console.error("Error in updateProfilePic:", error.message);
  
      return {
        headers: { "Content-Type": "application/json" },
        statusCode: 500, // Internal Server Error
        body: { error: error.message || "An unknown error occurred." },
      };
    }
  };;
  addPost=async(httpRequest:CustomRequest): Promise<any> =>{
    try {
      console.log(httpRequest,'...')
      if (!httpRequest.file) {
        return {
          headers: { "Content-Type": "application/json" },
          statusCode: 400, // Bad Request
          body: { error: "Profile picture is required." },
        };
      }

      
  
      // Extract user ID
      const userId = httpRequest?.user?.id;
      if (!userId) {
        throw new Error("User ID is missing.");
      }
      const { postText } = httpRequest.body;
    const filePath = httpRequest.file.path 
     const data:any={filePath,postText}
       const response=await this.userService.addPost(userId,data)
      return {
        headers: { "Content-Type": "application/json" },
        statusCode: 201, // Created
        body: {
          message: "Post and picture updated successfully.",
          response,
        },
      };
    } catch (error: any) {
      console.error("Error in addPost:", error.message);
  
      return {
        headers: { "Content-Type": "application/json" },
        statusCode: 500, // Internal Server Error
        body: { error: error.message || "An unknown error occurred." },
      };
    }
  }

  getPost=async(httpRequest:CustomRequest): Promise<ControllerResponse> =>{
    try {
      console.log(httpRequest)
      const userId = httpRequest?.user?.id;
      console.log(userId)
    
      if (!userId) {
        console.error('User ID not found');
        throw new Error('User ID is required to fetch the profile.');
      }
  
      
      const Posts = await this.userService.getPost();
      
      return {
        headers: {
          "Content-Type": "application/json",
        },
        statusCode: 201, 
        body: Posts ,
      };
    } catch (error: any) {
      console.error('Error in userPosts:', error.message);
  
      
      return {
        headers: {
          "Content-Type": "application/json",
        },
        statusCode: 500, 
        body: { error: error.message || 'An unknown error occurred.' },
      };
    }
  }
  addLike=async(httpRequest: CustomRequest): Promise<ControllerResponse> =>{
    try {
      
      const userId = httpRequest?.user?.id;
      const {postId}=httpRequest.body
    
      if (!userId) {
        console.error('User ID not found');
        throw new Error('User ID is required to fetch the profile.');
      }
  
      
      const likes = await this.userService.addLike(userId,postId);
      
      return {
        headers: {
          "Content-Type": "application/json",
        },
        statusCode: 201, 
        body:likes ,
      };
    } catch (error: any) {
      console.error('Error in addlikes:', error.message);
  
      
      return {
        headers: {
          "Content-Type": "application/json",
        },
        statusCode: 500, 
        body: { error: error.message || 'An unknown error occurred.' },
      };
    }
  }
  addComment=async(httpRequest:CustomRequest): Promise<ControllerResponse>=> {
    try {
      
     

      
  
      // Extract user ID
      const userId = httpRequest?.user?.id;
      if (!userId) {
        throw new Error("User ID is missing.");
      }
      const data = httpRequest.body;
     
     
       const response=await this.userService.addComment(userId,data)
      return {
        headers: { "Content-Type": "application/json" },
        statusCode: 201, // Created
        body: {
          message: "Post and picture updated successfully.",
          response,
        },
      };
    } catch (error: any) {
      console.error("Error in addPost:", error.message);
  
      return {
        headers: { "Content-Type": "application/json" },
        statusCode: 500, // Internal Server Error
        body: { error: error.message || "An unknown error occurred." },
      };
    }
  }
}
