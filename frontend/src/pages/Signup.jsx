"use client";
import React, { useState } from "react";
import { useForm } from "react-hook-form";
import {
  VStack,
  Field,
  Input,
  Button,
  Box,
  IconButton,
} from "@chakra-ui/react";
import { LuEye, LuEyeOff } from "react-icons/lu";
import {
  registerStart,
  registerSuccess,
  registerFailure,
} from "@/redux/slices/authSlice";
import { useDispatch } from "react-redux";
import { useRouter } from "next/navigation";
import { setToken } from "@/utils/helper";
import { toaster } from "@/components/ui/toaster";
import axios from "axios";

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
      <VStack gap={4} py={4}>
        <Field.Root invalid={!!errors.name} width="100%">
          <Field.Label color="black">Name</Field.Label>
          <Input
            type="text"
            placeholder="Enter your name"
            bg="white"
            color="black"
            borderColor="gray.300"
            {...register("name", {
              required: "Name is required",
              minLength: {
                value: 2,
                message: "Name must be at least 2 characters",
              },
            })}
          />
          <Field.ErrorText>{errors.name?.message}</Field.ErrorText>
        </Field.Root>

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

        <Field.Root invalid={!!errors.confirmPassword} width="100%">
          <Field.Label color="black">Confirm Password</Field.Label>
          <Box position="relative" width="100%">
            <Input
              type={showConfirmPassword ? "text" : "password"}
              placeholder="Confirm your password"
              bg="white"
              color="black"
              borderColor="gray.300"
              pr="40px"
              {...register("confirmPassword", {
                required: "Please confirm your password",
                validate: (value) =>
                  value === password || "Passwords do not match",
              })}
            />
            <IconButton
              aria-label={
                showConfirmPassword ? "Hide password" : "Show password"
              }
              position="absolute"
              right="0"
              top="50%"
              transform="translateY(-50%)"
              variant="ghost"
              size="sm"
              onClick={() => setShowConfirmPassword(!showConfirmPassword)}
            >
              {showConfirmPassword ? <LuEyeOff /> : <LuEye />}
            </IconButton>
          </Box>
          <Field.ErrorText>{errors.confirmPassword?.message}</Field.ErrorText>
        </Field.Root>

        <Button
          type="submit"
          colorPalette="teal"
          width="100%"
          loading={isSubmitting}
          loadingText="Creating account..."
          onClick={handleSubmit(onSubmit)}
        >
          Sign Up
        </Button>
      </VStack>
    </form>
  );
};

export default Signup;
