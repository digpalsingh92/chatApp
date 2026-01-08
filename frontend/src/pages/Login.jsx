"use client";
import React, { useState } from "react";
import { useDispatch } from "react-redux";
import {
  loginStart,
  loginSuccess,
  loginFailure,
} from "@/redux/slices/authSlice";
import axios from "axios";
import { useForm } from "react-hook-form";
import { useRouter } from "next/navigation";
import {
  VStack,
  Field,
  Input,
  Button,
  Box,
  IconButton,
} from "@chakra-ui/react";
import { toaster } from "@/components/ui/toaster";
import { LuEye, LuEyeOff } from "react-icons/lu";
import { setToken } from "@/utils/helper";

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
      <VStack gap={4} py={4}>
        <Field.Root invalid={!!errors.email} width="100%">
          <Field.Label color="black">Email</Field.Label>
          <Input
            type="email"
            placeholder="Enter your email"
            bg="white"
            color="black"
            borderColor="gray.300"
            {...register("email", {
              required: "Email is required",
              pattern: {
                value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                message: "Invalid email address",
              },
            })}
          />
          <Field.ErrorText>{errors.email?.message}</Field.ErrorText>
        </Field.Root>

        <Field.Root invalid={!!errors.password} width="100%">
          <Field.Label color="black">Password</Field.Label>
          <Box position="relative" width="100%">
            <Input
              type={showPassword ? "text" : "password"}
              placeholder="Enter your password"
              bg="white"
              color="black"
              borderColor="gray.300"
              pr="40px"
              {...register("password", {
                required: "Password is required",
                minLength: {
                  value: 6,
                  message: "Password must be at least 6 characters",
                },
              })}
            />
            <IconButton
              aria-label={showPassword ? "Hide password" : "Show password"}
              position="absolute"
              right="0"
              top="50%"
              transform="translateY(-50%)"
              variant="ghost"
              size="sm"
              onClick={() => setShowPassword(!showPassword)}
            >
              {showPassword ? <LuEyeOff /> : <LuEye />}
            </IconButton>
          </Box>
          <Field.ErrorText>{errors.password?.message}</Field.ErrorText>
        </Field.Root>
        <Button
          type="submit"
          colorPalette="teal"
          width="100%"
          loading={isSubmitting}
          onClick={handleSubmit(onSubmit)}
        >
          Login
        </Button>
      </VStack>
    </form>
  );
};

export default Login;
