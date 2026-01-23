"use client";
import React, { useState, useEffect } from "react";
import { useDispatch } from "react-redux";
import {
  loginStart,
  loginSuccess,
  loginFailure,
} from "@/redux/slices/authSlice";
import axios from "axios";
import { useForm } from "react-hook-form";
import { useRouter } from "next/navigation";
import { toaster } from "@/components/ui/toast";
import { LuEye, LuEyeOff } from "react-icons/lu";
import { setToken, getToken } from "@/utils/helper";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";

const Login = () => {
  const [showPassword, setShowPassword] = useState(false);
  const dispatch = useDispatch();
  const router = useRouter();
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm({
    defaultValues: {
      email: "",
      password: "",
    },
  });

  useEffect(() => {
    if (getToken()) {
      router.push("/chats");
    }
  }, []);

  const onSubmit = async (data) => {
    try {
      dispatch(loginStart());
      const response = await axios.post(
        `${process.env.NEXT_PUBLIC_WEB_URL}/api/user/login`,
        data
      );
      setToken(response.data.token);
      dispatch(loginSuccess(response.data));

      toaster.create({
        title: "Login Successful",
        description: response.data.message,
        type: "success",
        duration: 3000,
      });
      router.push("/chats");
    } catch (error) {
      const errorMessage =
        error.response?.data?.message || error.message || "Login failed";
      dispatch(loginFailure(errorMessage));

      toaster.create({
        title: "Login Failed",
        description: errorMessage,
        type: "error",
        duration: 4000,
      });
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <div className="flex flex-col gap-4 py-4">
        <div className="w-full">
          <Label htmlFor="email" className="text-black">Email</Label>
          <Input
            id="email"
            type="email"
            placeholder="Enter your email"
            className="bg-white text-black border-gray-300 mt-1"
            {...register("email", {
              required: "Email is required",
              pattern: {
                value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                message: "Invalid email address",
              },
            })}
          />
          {errors.email && (
            <p className="text-xs text-red-500 mt-1">{errors.email.message}</p>
          )}
        </div>

        <div className="w-full">
          <Label htmlFor="password" className="text-black">Password</Label>
          <div className="relative mt-1">
            <Input
              id="password"
              type={showPassword ? "text" : "password"}
              placeholder="Enter your password"
              className="bg-white text-black border-gray-300 pr-10"
              {...register("password", {
                required: "Password is required",
                minLength: {
                  value: 6,
                  message: "Password must be at least 6 characters",
                },
              })}
            />
            <button
              type="button"
              aria-label={showPassword ? "Hide password" : "Show password"}
              className="absolute right-0 top-1/2 -translate-y-1/2 p-1 hover:bg-gray-100 rounded"
              onClick={() => setShowPassword(!showPassword)}
            >
              {showPassword ? <LuEyeOff size={16} /> : <LuEye size={16} />}
            </button>
          </div>
          {errors.password && (
            <p className="text-xs text-red-500 mt-1">{errors.password.message}</p>
          )}
        </div>
        <Button
          type="submit"
          className="w-full"
          disabled={isSubmitting}
        >
          {isSubmitting ? "Logging in..." : "Login"}
        </Button>
      </div>
    </form>
  );
};

export default Login;
