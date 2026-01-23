"use client";
import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { LuEye, LuEyeOff } from "react-icons/lu";
import {
  registerStart,
  registerSuccess,
  registerFailure,
} from "@/redux/slices/authSlice";
import { useDispatch } from "react-redux";
import { useRouter } from "next/navigation";
import { setToken } from "@/utils/helper";
import { toaster } from "@/components/ui/toast";
import axios from "axios";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";

const Signup = () => {
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const router = useRouter();
  const dispatch = useDispatch();

  const {
    register,
    handleSubmit,
    watch,
    formState: { errors, isSubmitting },
  } = useForm({
    defaultValues: {
      name: "",
      email: "",
      password: "",
    },
  });

  const password = watch("password");

  const onSubmit = async (data) => {
    try {
      dispatch(registerStart());
      if (
        !data.email ||
        !data.password ||
        !data.name ||
        !data.confirmPassword
      ) {
        toaster.create({
          title: "Signup Failed",
          description: "All fields are required",
          type: "error",
          duration: 4000,
        });
        return;
      }
      if (data.password !== data.confirmPassword) {
        toaster.create({
          title: "Signup Failed",
          description: "Passwords do not match",
          type: "error",
          duration: 4000,
        });
        return;
      }
      const response = await axios.post(
        `${process.env.NEXT_PUBLIC_WEB_URL}/api/user/register`,
        data
      );
      setToken(response.data.token);
      dispatch(registerSuccess(response.data));

      toaster.create({
        title: "Signup Successful",
        description: response.data.message,
        type: "success",
        duration: 3000,
      });
      router.push("/chats");
    } catch (error) {
      const errorMessage =
        error.response?.data?.message || error.message || "Signup failed";
      dispatch(registerFailure(errorMessage));

      toaster.create({
        title: "Signup Failed",
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
          <Label htmlFor="name" className="text-black">Name</Label>
          <Input
            id="name"
            type="text"
            placeholder="Enter your name"
            className="bg-white text-black border-gray-300 mt-1"
            {...register("name", {
              required: "Name is required",
              minLength: {
                value: 2,
                message: "Name must be at least 2 characters",
              },
            })}
          />
          {errors.name && (
            <p className="text-xs text-red-500 mt-1">{errors.name.message}</p>
          )}
        </div>

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

        <div className="w-full">
          <Label htmlFor="confirmPassword" className="text-black">Confirm Password</Label>
          <div className="relative mt-1">
            <Input
              id="confirmPassword"
              type={showConfirmPassword ? "text" : "password"}
              placeholder="Confirm your password"
              className="bg-white text-black border-gray-300 pr-10"
              {...register("confirmPassword", {
                required: "Please confirm your password",
                validate: (value) =>
                  value === password || "Passwords do not match",
              })}
            />
            <button
              type="button"
              aria-label={
                showConfirmPassword ? "Hide password" : "Show password"
              }
              className="absolute right-0 top-1/2 -translate-y-1/2 p-1 hover:bg-gray-100 rounded"
              onClick={() => setShowConfirmPassword(!showConfirmPassword)}
            >
              {showConfirmPassword ? <LuEyeOff size={16} /> : <LuEye size={16} />}
            </button>
          </div>
          {errors.confirmPassword && (
            <p className="text-xs text-red-500 mt-1">{errors.confirmPassword.message}</p>
          )}
        </div>

        <Button
          type="submit"
          className="w-full"
          disabled={isSubmitting}
        >
          {isSubmitting ? "Creating account..." : "Sign Up"}
        </Button>
      </div>
    </form>
  );
};

export default Signup;
