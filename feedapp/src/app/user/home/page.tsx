"use client";
import { ToastContainer, toast } from "react-toastify";
import React, { useState, useEffect } from "react";
import { Camera, Heart, MessageCircle, Send } from "lucide-react";
import { addCommentApi, getCommentApi, getpostApi, likeApi, postApi, profileApi, profilepicApi } from "@/Service/userApi/page";
import Swal from "sweetalert2";
import Img from '../../../../public/_21fb8c3c-fafc-4ae3-a783-4d49f6601b61.jpeg'
import axiosInstance from "@/Components/utils/axiosInstance";
interface UserProfile {
  readonly _id: string;
  readonly username: string;
  readonly email: string;
  readonly phone: string;
  readonly age: string;
  readonly profilePic: string;
  readonly address: string;
  readonly gender?: string;
  readonly createdAt: Date;
  readonly updatedAt: Date;
}

interface Post {
  readonly _id: string;
  readonly content: string;
  readonly image?: string;
  readonly likes: string[]; 
  readonly comments:any; 
  readonly userId:any
  readonly createdAt: Date;
}

const Home: React.FC = () => {
  const [profilePic, setProfilePic] = useState<string | null>(null);
  const [user, setUsers] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(true);
  const [isOpen, setIsOpen] = useState(false);
  const [postText, setPostText] = useState<string>("");
  const [posts, setPosts] = useState<Post[]>([]);
  const [image, setImage] = useState<string | null>(null);
  const [image1, setImage1] = useState<File | null>(null);
  const [isOpen1, setIsOpen1] = useState(false);
  const [commentText, setCommentText] = useState("");
  const [currentPostId, setCurrentPostId] = useState<string | null>(null);
  const [comment, setComment] = React.useState<any[]>([]);
  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const response = await profileApi();
        setUsers(response.data);
      } catch (error) {
        console.error("Error fetching users:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchUsers();
  }, []);

  useEffect(() => {
    const fetchPosts = async () => {
      try {
        const response = await getpostApi();
        setPosts(response.data);
      } catch (error) {
        console.error("Error fetching posts:", error);
      }
    };

    fetchPosts();
  }, []);

  const handleImageChange1 = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    const imageUrl = URL.createObjectURL(file);
    setImage(imageUrl);
    setImage1(file);
  };
 
  const handlePost = async () => {
    if (!postText && !image1) {
      Swal.fire({
        icon: "error",
        title: "Oops...",
        text: "Post text or image is required!",
      });
      return;
    }

    const formData = new FormData();
    formData.append("postText", postText);
    if (image1) {
      formData.append("file", image1);
    }

    try {
      const response = await postApi(formData);
      if (response.data) {
        setPosts([response.data.response, ...posts]); 
        Swal.fire({
          icon: "success",
          title: "Success!",
          text: "Post uploaded successfully.",
        });
        
      }

      setIsOpen(false);
      setPostText("");
      setImage(null);
      setImage1(null);
    } catch (error) {
      console.error("Error posting data:", error);
      Swal.fire({
        icon: "error",
        title: "Error!",
        text: "Something went wrong. Please try again later.",
      });
    }
  };

  const handleLike = async (postId: string) => {
    try {
      const response = await likeApi(postId);
  
      if (response.data) {
        console.log(response.data);
      }
  
      const updatedPosts = posts.map((post) => {
        if (post._id === postId) {
          const hasLiked = post.likes.includes(user?._id || "");
  
          return {
            ...post,
            likes: hasLiked
              ? post.likes.filter((id) => id !== user?._id)
              : [...post.likes, user?._id || ""],
          };
        }
        return post;
      });
  
      setPosts(updatedPosts);
    } catch (error) {
      console.error("Error liking post:", error);
    }
  };
  
  

  const handleComment = async (postId: string, commentText: string) => {
    try {
      const response=await addCommentApi({postId,commentText})
      console.log(response.data)
      const updatedPosts = posts.map((post) =>
        post._id === postId
          ? {
              ...post,
              comments: [
                ...post.comments,
                { userId: user?._id || "", text: commentText },
              ],
            }
          : post
      );
      setPosts(updatedPosts);
    } catch (error) {
      console.error("Error adding comment:", error);
    }
  };
  
  const handleImageUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      const imageUrl = URL.createObjectURL(file);
      setProfilePic(imageUrl);
    }
    try {
      const formData = new FormData();
      if (file) formData.append("file", file);

      const response = await profilepicApi(formData);

      toast.success("File uploaded successfully!");
      console.log(response.data);
      setProfilePic(response.data.filePath);
    } catch (error: any) {
      toast.error(error.response?.data?.error || "Upload failed. Please try again.");
      console.error("Upload error:", error);
    }
  };
  const handleClick = (userId:string) => {
    const userPosts = posts.filter((post) => post.userId?._id === userId);
    setPosts(userPosts);

  };

  async function handleLogout(event: React.MouseEvent<HTMLElement>) {
    event.preventDefault();
  
    try {
      await axiosInstance.post(
        `${process.env.NEXT_PUBLIC_USER_BACKEND_URL}/logout`,
        {},
        { withCredentials: true }
      );
      localStorage.removeItem("user");
      window.location.href = "/user/login";
    } catch (error) {
      console.error("Logout failed:", error);
    }
  }


  const getComments = async (postId: string) => {
    try {
      const response = await getCommentApi(postId);
      setComment(response.data.response)
      return response.data; 
    } catch (error) {
      console.error("Error fetching comments:", error);
      throw error; // Re-throwing the error to handle it in the calling function
    }
  };
  
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
    }); // Example: "March 3, 2025"
  };
  
  return (
    <div className="min-h-screen bg-gray-100">
      {/* Navbar */}
      <nav className="bg-white shadow-md">
        <div className="container mx-auto px-4 py-2 flex justify-between items-center">
          <div className="text-2xl font-bold text-blue-600">FeedIn</div>
          <div className="flex space-x-4">
           
            <button onClick={handleLogout} className="bg-blue-600 text-white px-4 py-2 rounded-full">logout</button>
          </div>
        </div>
      </nav>

      {/* Main Content */}
      <div className="container mx-auto px-4 py-6 flex space-x-6">
        {/* Sidebar */}
        <div className="w-1/4 bg-white p-4 rounded-lg shadow-md flex flex-col items-center">
          <div className="text-lg font-semibold mb-4">Profile</div>
          <div className="relative w-[150px] h-[150px]">
          <img
  src={
    typeof profilePic === "string"
      ? profilePic
      : typeof user?.profilePic === "string"
      ? user.profilePic
      : typeof Img === "object" && "src" in Img
      ? Img.src
      : undefined
  }
  alt="Profile"
  className="w-[150px] h-[150px] rounded-full object-cover border border-gray-300"
/>
            <label className="absolute bottom-0 right-0 bg-gray-200 p-1 rounded-full cursor-pointer hover:bg-gray-300">
              <Camera size={18} className="text-gray-600" />
              <input type="file" accept="image/*" className="hidden" onChange={handleImageUpload} />
            </label>
          </div>
          <div className="mt-3 text-center">
            <div className="font-semibold text-lg">{user?.username}</div>
            <div className="text-sm text-gray-500">Software Engineer</div>
          </div>
          <div className="mt-4 text-sm text-gray-600">
        <p>Email: {user?.email}</p>
        <p>Phone: {user?.phone}</p>
        <p>Age: {user?.age}</p>
        <p>Address: {user?.address}</p>
        {user?.gender && <p>Gender: {user?.gender}</p>}
      </div>
      <div className="mt-10 bg-gray-100 p-4 rounded-lg shadow-md flex justify-center">
  <button onClick={()=>{handleClick(user?._id as any)}} className="px-6 py-2 text-white bg-gradient-to-r from-red-500 to-pink-500 rounded-full shadow-lg hover:scale-105 transition-all duration-300">
    My Posts
  </button>
</div>

        </div>

        {/* Feed */}
        <div className="w-1/2 space-y-6">
          {/* Create Post */}
          <div className="bg-white p-4 rounded-lg shadow-md cursor-pointer" onClick={() => setIsOpen(true)}>
            <div className="flex items-center space-x-4">
              <img
                 src={
                  typeof profilePic === "string"
                    ? profilePic
                    : typeof user?.profilePic === "string"
                    ? user.profilePic
                    : typeof Img === "object" && "src" in Img
                    ? Img.src
                    : undefined
                }
                alt="User Profile"
                className="w-20 h-20 rounded-full object-cover"
              />
              <input
                type="text"
                placeholder="Start a post"
                className="flex-1 px-4 py-2 border rounded-full focus:outline-none cursor-pointer"
                readOnly
              />
            </div>
          </div>

          {/* Modal */}
          {isOpen && (
            <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 backdrop-blur-sm transition-opacity duration-300">
              <div className="bg-white p-8 rounded-lg shadow-2xl w-[600px] transform transition-transform duration-300 scale-95 hover:scale-100 max-h-[90vh] overflow-y-auto">
                <h2 className="text-2xl font-semibold mb-6 text-gray-800">Create Post</h2>
                <div className="flex items-center space-x-4 mb-6">
                  <img
                    src={
                      typeof profilePic === "string"
                        ? profilePic
                        : typeof user?.profilePic === "string"
                        ? user.profilePic
                        : typeof Img === "object" && "src" in Img
                        ? Img.src
                        : undefined
                    }
                    alt="User Avatar"
                    className="w-12 h-12 rounded-full"
                  />
                  <span className="font-medium text-gray-700 text-lg">{user?.username}</span>
                </div>
                <textarea
                  className="w-full border rounded-lg p-4 focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none text-lg"
                  placeholder="What's on your mind?"
                  rows={6}
                  value={postText}
                  onChange={(e) => setPostText(e.target.value)}
                ></textarea>
                {image && (
                  <div className="mt-6 relative">
                    <img
                      src={image}
                      alt="Uploaded"
                      className="w-full rounded-lg shadow-sm max-h-96 object-cover"
                    />
                    <button
                      onClick={() => setImage(null)}
                      className="absolute top-3 right-3 bg-white rounded-full p-2 hover:bg-gray-100"
                    >
                      ❌
                    </button>
                  </div>
                )}
                <label className="mt-6 flex items-center justify-center bg-gray-100 p-4 rounded-lg cursor-pointer hover:bg-gray-200 transition-colors duration-200">
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleImageChange1}
                    className="hidden"
                  />
                  <span className="text-gray-600 text-lg">Upload Photo</span>
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-6 w-6 ml-2 text-gray-600"
                    viewBox="0 0 20 20"
                    fill="currentColor"
                  >
                    <path
                      fillRule="evenodd"
                      d="M4 5a2 2 0 00-2 2v8a2 2 0 002 2h12a2 2 0 002-2V7a2 2 0 00-2-2h-2.586a1 1 0 01-.707-.293l-1.414-1.414A2 2 0 0010.586 3H9.414a2 2 0 00-1.414.586L6.293 4.707A1 1 0 015.586 5H4z"
                      clipRule="evenodd"
                    />
                  </svg>
                </label>
                <div className="flex justify-end space-x-4 mt-8">
                  <button
                    className="px-6 py-3 rounded-md text-gray-600 hover:bg-gray-100 transition-colors duration-200 text-lg"
                    onClick={() => setIsOpen(false)}
                  >
                    Cancel
                  </button>
                  <button
                    className="px-6 py-3 rounded-md bg-blue-500 text-white hover:bg-blue-600 transition-colors duration-200 text-lg"
                    onClick={handlePost}
                  >
                    Post
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* Posts */}
          <div className="w-2/2 space-y-4 max-h-[80vh] overflow-y-auto">
            {posts.map((post) => (
              <div key={post._id} className="bg-white p-4 rounded-lg shadow-md mb-4">
                <div className="flex items-center space-x-4">
                  <img
                    src={
                      typeof post?.userId?.profilePic === "string"
                        ? post.userId.profilePic
                        : typeof Img === "object" && "src" in Img
                        ? Img.src
                        : undefined
                    }
                    alt="User Profile"
                    className="w-10 h-10 rounded-full"
                  />
                  <div>
                    <div className="font-semibold">{post?.userId?.username}</div>
                    <div className="text-sm text-gray-500">
                      {new Date(post.createdAt).toLocaleString()}
                    </div>
                  </div>
                </div>
                <div className="mt-4">
                  <p>{post?.content}</p>
                  {post?.image && (
                    <img
                      src={post?.image}
                      alt="Post Image"
                      className="w-full rounded-lg mt-3"
                    />
                  )}
                </div>
                <div className="flex items-center space-x-4 mt-4">
                  <button
                    className="flex items-center space-x-2 text-gray-600 hover:text-red-500"
                    onClick={() => handleLike(post?._id)}
                  >
                    <Heart size={20} />
                    <span>{post?.likes?.length} Likes</span>
                  </button>
                  <button
                    className="flex items-center space-x-2 text-gray-600 hover:text-blue-500"
                    onClick={() => {
                      setCurrentPostId(post._id);
                      setIsOpen1(true);
                    }}
                  >
                    <MessageCircle size={20} />
                    <span>Comments</span>
                  </button>
                  <button
                    className="flex items-center space-x-2 text-gray-600 hover:text-blue-500"
                    onClick={() => {
                      setCurrentPostId(post._id);
                      getComments(post?._id)
                    }}
                  >
                    <MessageCircle size={20} />
                    <span>  All Comments</span>
                  </button>
                </div>
                {isOpen1 && currentPostId === post._id && (
                  <div
                    className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 backdrop-blur-sm transition-opacity duration-300"
                    aria-hidden={!isOpen1}
                    onKeyDown={(e) => {
                      if (e.key === "Escape") setIsOpen1(false);
                    }}
                  >
                    <div className="bg-white p-6 rounded-lg shadow-2xl w-96 transform transition-transform duration-300 scale-95 hover:scale-100">
                      <h2 className="text-xl font-semibold mb-4 text-gray-800">Add a Comment</h2>
                      <textarea
                        className="w-full p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none"
                        placeholder="Type your comment..."
                        rows={3}
                        value={commentText}
                        autoFocus
                        onChange={(e) => setCommentText(e.target.value)}
                        onKeyDown={(e) => {
                          if (e.key === "Enter" && commentText.trim() && !e.shiftKey) {
                            e.preventDefault(); // Prevent new line on Enter
                            if (currentPostId) {
                              handleComment(currentPostId, commentText);
                            }
                            setCommentText("");
                            setIsOpen1(false);
                          }
                        }}
                      />
                      <div className="flex justify-end mt-4 space-x-3">
                        <button
                          className="px-4 py-2 text-gray-600 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors duration-200"
                          onClick={() => {
                            setIsOpen1(false);
                            setCurrentPostId(null);
                          }}
                        >
                          Cancel
                        </button>
                        <button
                          className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors duration-200"
                          onClick={() => {
                            if (commentText.trim() && currentPostId) {
                              handleComment(currentPostId, commentText);
                              setCommentText("");
                              setIsOpen1(false);
                            }
                          }}
                        >
                          Submit
                        </button>
                      </div>
                    </div>
                  </div>
                )}

    {/* Comments Section */}
    <div
  
>
  
</div>
  </div>
))}
</div>
        </div>

        {/* Right Sidebar */}
        <div className="fixed right-5 top-20 w-1/4 h-[500px] bg-white p-4 rounded-lg shadow-lg border border-gray-200">
      <div className="text-xl font-semibold mb-4">Comments</div>
      <div className="h-full overflow-y-auto space-y-3">
        {comment.length === 0 ? (
          <div className="text-gray-500 text-sm italic">No comments yet</div>
        ) : (
          <div className="fixed right-5 top-20 w-1/4 h-[500px] bg-white p-4 rounded-lg shadow-lg border border-gray-200">
      <div className="text-xl font-semibold mb-4">Comment</div>
      <div className="h-full overflow-y-auto space-y-4">
        {comment?.length === 0 ? (
          <div className="text-gray-500 text-sm italic">No comments yet</div>
        ) : (
          comment?.map((comment:any) => (
            <div key={comment?._id} className="flex items-start gap-3 p-2 bg-gray-50 rounded-lg shadow-sm">
              <img
                src={comment?.userId?.profilePic}
                alt={comment?.userId?.username}
                className="w-10 h-10 rounded-full border border-gray-300"
              />
              <div>
                <div className="flex items-center gap-2">
                  <span className="font-semibold text-gray-800">{comment?.userId?.username}</span>
                  <span className="text-xs text-gray-500">{formatDate(comment?.createdAt)}</span>
                </div>
                <p className="text-sm text-gray-700">{comment?.text}</p>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
        )}
      </div>
    </div>
      </div>
      <ToastContainer />
    </div>
  );
};

export default Home;