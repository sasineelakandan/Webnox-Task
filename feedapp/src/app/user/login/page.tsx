"use client";
import React, { useState } from "react";
import { useForm, SubmitHandler, FieldValues } from "react-hook-form";
import { FaEye, FaEyeSlash } from "react-icons/fa";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import axios from "axios";
import { useRouter } from "next/navigation";
import { setUserDetails } from "../../../Store/slices/userSlice";
import { useDispatch } from "react-redux";
import { loginApi } from "@/Service/userApi/page";

interface LoginFormValues extends FieldValues {
  email: string;
  password: string;
}

function Login() {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginFormValues>();

  const router = useRouter();
  const dispatch = useDispatch();
  const [showPassword, setShowPassword] = useState(false);

  const togglePasswordVisibility = () => setShowPassword(!showPassword);

  const onSubmit: SubmitHandler<LoginFormValues> = async (data) => {
    try {
      const response = await loginApi(data);

      if (response.data) {
        dispatch(
          setUserDetails({
            username: response.data.username,
            email: response.data.email,
            userId: response.data._id,
            isAuthenticated: true,
          })
        );

        toast.success(`Welcome back, Dr. ${response.data.username}!`, {
          position: "top-center",
          autoClose: 2000,
          theme: "colored",
        });

        toast.info("Redirecting to your dashboard...", {
          position: "top-center",
          autoClose: 2000,
          theme: "colored",
        });

        setTimeout(() => {
          router.replace("/user/home");
        }, 3000);
      }
    } catch (error: any) {
      if (axios.isAxiosError(error)) {
        const errorMessage =
          error.response?.data?.error || "Please check your email & password";
        toast.error(errorMessage);
      } else {
        toast.error("Something went wrong. Please try again later.");
      }
    }
  };

  return (
    <>
      <div className="flex flex-col items-center justify-center min-h-screen bg-gradient-to-br from-teal-400 via-teal-500 to-teal-600 p-4">
        <form
          onSubmit={handleSubmit(onSubmit)}
          className="bg-white shadow-lg rounded-lg p-8 w-full max-w-md border border-teal-300 transition-all duration-300 ease-in-out transform hover:scale-105"
        >
          <h2 className="text-3xl font-semibold text-gray-800 mb-6 text-center">
            Login
          </h2>

          {/* Email Input */}
          <div className="mb-4">
            <input
              {...register("email", { required: "Email is required" })}
              type="text"
              placeholder="Enter your email"
              className="border border-gray-300 rounded-lg w-full py-3 px-4 text-gray-700 focus:outline-none focus:ring-2 focus:ring-teal-500 transition duration-300"
            />
            {errors.email && (
              <p className="text-red-500 text-xs mt-1">{errors.email.message}</p>
            )}
          </div>

          {/* Password Input */}
          <div className="mb-4 relative">
            <input
              {...register("password", { required: "Password is required" })}
              type={showPassword ? "text" : "password"}
              placeholder="Enter your password"
              className="border border-gray-300 rounded-lg w-full py-3 px-4 text-gray-700 focus:outline-none focus:ring-2 focus:ring-teal-500 transition duration-300"
            />
            <span
              onClick={togglePasswordVisibility}
              className="absolute right-3 top-3 text-gray-500 cursor-pointer"
            >
              {showPassword ? <FaEyeSlash /> : <FaEye />}
            </span>
            {errors.password && (
              <p className="text-red-500 text-xs mt-1">
                {errors.password.message}
              </p>
            )}
          </div>

          {/* Login Button */}
          <button
            type="submit"
            className="w-full bg-teal-600 hover:bg-teal-700 text-white font-semibold py-3 rounded mt-4 transition duration-300 transform hover:scale-105"
          >
            Login
          </button>

          {/* Divider */}
          <div className="flex items-center justify-center my-6 relative">
            <hr className="w-full border-t border-gray-300" />
            <span className="absolute bg-white px-4 text-gray-500">or</span>
          </div>

          {/* Sign-Up Link */}
          <p className="text-center text-gray-600 text-sm mt-6">
            Don't have an account?{" "}
            <a
              href="/user/signup"
              className="text-teal-500 hover:text-teal-700 font-semibold"
            >
              Sign Up
            </a>
          </p>
        </form>
      </div>
      <ToastContainer position="top-right" autoClose={3000} />
    </>
  );
}

export default Login;
