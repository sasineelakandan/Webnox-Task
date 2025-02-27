import { IUserRepository } from "../interface/repositories/userRepository.interface";
import {
  AddUserInput,
  AddUserOuput,
  GetUserOutput,
  GetuserProfileOutput,
  PostDatas,
  SuccessResponse,
} from "../interface/repositories/userRepository.types";
import Post from "../models/Post";
import User from "../models/User";
import { ObjectId } from "mongodb";
export class UserRepository implements IUserRepository {
  addUser = async (userData: AddUserInput): Promise<AddUserOuput> => {
    try {
      const user = await User.create({
        ...userData,
        age: Number(userData.age),
      });

      return {
        _id: user._id.toString(),
        username: user.username,
        email: user.email,
        phone: user.phone,
        age: user.age.toString(),
        address: user.address,
        gender: user.gender,
        createdAt: user.createdAt,
        updatedAt: user.updatedAt,
      };
    } catch (error: any) {
      console.error("Error adding user:", error);
      if (error.code === 11000) {
        const field = Object.keys(error.keyValue)[0]; 
        const value = error.keyValue[field]; 
        error.message = `${field} '${value}' already exists.`;
      }
      throw new Error(error.message);
    }
  };
  getUserByEmail = async (email: string): Promise<GetUserOutput> => {
    try {
      const user = await User.findOne({ email });
      if (!user) throw new Error("User not found");

      return {
        _id: user._id.toString(),
        username: user.username,
        email: user.email,
        phone: user.phone,
        password: user.password,
        age: user.age.toString(),
        address: user.address,
        gender: user.gender,
        createdAt: user.createdAt,
        updatedAt: user.updatedAt,
      };
    } catch (error: any) {
      console.error("Error getting user by email:", error);

      throw new Error(error.message);
    }
  };

  userProfile=async(userId: string): Promise<GetuserProfileOutput> =>{
    
  
      
    
    try{
      
      const user=await User.findOne({_id:userId})
      if (!user) {
        throw new Error(`Doctor with ID ${userId} not found.`);
      }
      return {
        _id: user._id.toString(),
        username: user.username,
        email: user.email,
        phone: user.phone,
        password: user.password,
        profilePic:user.profilePic||'',
        age: user.age.toString(),
        address: user.address,
        gender: user.gender,
        createdAt: user.createdAt,
        updatedAt: user.updatedAt,
      };;

    }catch(error:any){
      console.error("Error find loginUser:", error);
      
      throw new Error(error.message);
    }
  }
updateProfilePic=async(userId: string, profilePic: string): Promise<SuccessResponse>=> {
  

    try {
    
      if (!userId) {
        throw new Error(`user with ID ${userId} not found.`);
      }
      const updateProfilePic = await User.updateOne(
        { _id: userId },
        { $set: { profilePic: profilePic } }
      )
      
    
      return {
        status: 'success',
        message: 'Slot assigned successfully',
      };
    } catch (error: any) {
      console.error("Error in slot creation:", error);
      throw new Error(error.message);
    }
  }

  addPost=async(userId: string, data: any): Promise<any>=> {
    
    try {
    
      if (!userId) {
        throw new Error(`user with ID ${userId} not found.`);
      }
      const addPost = await Post.create({
         userId,
         content:data.postText,
         image:data.filePath
      })
      
      await addPost.save()
      
      return addPost
    } catch (error: any) {
      console.error("Error in addpost:", error);
      throw new Error(error.message);
    }
  }

  getPost=async(): Promise<PostDatas>=> {
    try {
      const posts = await Post.find().sort({ _id: -1 }).populate('userId');

      if (!posts) throw new Error("User not found");
      console.log(posts)
      return posts
    } catch (error: any) {
      console.error("Error getting Posts:", error);

      throw new Error(error.message);
    }
  }

  addLike = async (userId:string, postId:string):Promise<any> => {
    try {
      const post = await Post.findById(postId);
      if (!post) throw new Error("Post not found");
      const objectId = new ObjectId(userId)
      const likeIndex = post.likes.indexOf(objectId);
  
      if (likeIndex === -1) {
        
        post.likes.push(objectId);
      } else {
        
        post.likes.splice(likeIndex, 1);
      }
  
      await post.save();
  
      return post
    } catch (error:any) {
      console.error("Error updating like status:", error);
      throw new Error(error.message);
    }
  };
addComment=async(userId: string, data: any): Promise<any>=> {
 
    
    try {
      if (!userId) {
        throw new Error("User ID is required.");
      }
      if (!data.postId) {
        throw new Error("Post ID is required.");
      }
      if (!data.commentText) {
        throw new Error("Comment text cannot be empty.");
      }
  
      const newComment = {
        userId: new ObjectId(userId),
        text: data.commentText,
        createdAt: new Date(),
      };
  console.log(data.postId)
      
      const updatedPost = await Post.findByIdAndUpdate(
        data.postId,
        { $push: { comments: newComment } },
        { new: true }
      ).populate({
        path: "comments.userId",
        select: "username profilePic", 
      });
  
      if (!updatedPost) {
        throw new Error("Post not found.");
      }
  
      return updatedPost;
    } catch (error: any) {
      console.error("Error in addComment:", error);
      throw new Error(error.message);
    }
  };
  
  }



