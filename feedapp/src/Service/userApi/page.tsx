import axios from 'axios';
import axiosInstance from '@/Components/utils/axiosInstance';
export const handleAxiosErrorlogin = (error:any)=>{
    console.log(error)
    const errorMessage = error?.response?.data?.errorMessage || "Unexpected error occurred"
    console.log(errorMessage)
    return new Error(errorMessage)
  }

  ;
  export const signupApi = async (data: Record<string, any>) => {
      try {
          console.log(data)
          const response = await axiosInstance.post(
              `${process.env.NEXT_PUBLIC_USER_BACKEND_URL}/signup`,
              data,
              { withCredentials: true }
          )
         
        return response;
      } catch (error: any) {
        console.log(error,"from api")
        throw error; 
      }
    };



export const loginApi = async (data: Record<string, any>) => {
    try {
        const response=await axiosInstance.post(
            `${process.env.NEXT_PUBLIC_USER_BACKEND_URL}/login`,
            data,
            { withCredentials: true }
          );
       
      return response;
    } catch (error: any) {
      console.log(error,"from api")
      throw error; 
    }
  };


  export const profileApi = async () => {
    try {
        const response=await axiosInstance.get(
            `${process.env.NEXT_PUBLIC_USER_BACKEND_URL}/profile`,
            
            { withCredentials: true }
          );
      return response;
    } catch (error: any) {
      console.log(error,"from api")
      throw error; 
    }
  };

  export const profilepicApi = async (formData: Record<string, any>) => {
    try {
        const response = await axiosInstance.post(`${process.env.NEXT_PUBLIC_USER_BACKEND_URL}/profile`, formData, {
            headers: {
              "Content-Type": "multipart/form-data",
            },
            withCredentials: true, // Enables sending cookies and authentication headers
          });
      return response;
    } catch (error: any) {
      console.log(error,"from api")
      throw error; 
    }
  };

  export const postApi = async (formData: Record<string, any>) => {

    try {
      console.log(formData)
        const response = await axiosInstance.post(`${process.env.NEXT_PUBLIC_USER_BACKEND_URL}/post`, formData, {
            headers: {
              "Content-Type": "multipart/form-data",
            },
            withCredentials: true, // Enables sending cookies and authentication headers
          });
      return response;
    } catch (error: any) {
      console.log(error,"from api")
      throw error; 
    }
  };


  export const getpostApi = async () => {

    try {
      const response=await axiosInstance.get(
          `${process.env.NEXT_PUBLIC_USER_BACKEND_URL}/post`,
          
          { withCredentials: true }
        );
    return response;
  } catch (error: any) {
    console.log(error,"from api")
    throw error; 
  }
  };

  export const likeApi = async (postId:string) => {

    try {
      console.log(postId)
      const response=await axiosInstance.patch(
          `${process.env.NEXT_PUBLIC_USER_BACKEND_URL}/post`,
          {postId},
          { withCredentials: true }
        );
    return response;
  } catch (error: any) {
    console.log(error,"from api")
    throw error; 
  }
  };


  export const addCommentApi = async (data:any) => {

    try {
      
      const response=await axiosInstance.post(
          `${process.env.NEXT_PUBLIC_USER_BACKEND_URL}/comments`,
          data,
          { withCredentials: true }
        );
    return response;
  } catch (error: any) {
    console.log(error,"from api")
    throw error; 
  }


  };

  export const getCommentApi = async (postId:any) => {

    try {
      
      const response=await axiosInstance.get(
          `${process.env.NEXT_PUBLIC_USER_BACKEND_URL}/comments?postId=${postId}`,
          
          { withCredentials: true }
        );
    return response;
  } catch (error: any) {
    console.log(error,"from api")
    throw error; 
  }

  
  };