"use client";
import React, { useState, useRef } from "react";
import { useForm } from "react-hook-form";
import {
  VStack,
  Field,
  Input,
  Button,
  Box,
  IconButton,
  Image,
  Text,
  HStack,
} from "@chakra-ui/react";
import { LuEye, LuEyeOff, LuUpload, LuX } from "react-icons/lu";

const Signup = () => {
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [profilePic, setProfilePic] = useState(null);
  const [profilePicPreview, setProfilePicPreview] = useState(null);
  const fileInputRef = useRef(null);

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
      confirmPassword: "",
    },
  });

  const password = watch("password");

  const handleProfilePicChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setProfilePic(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setProfilePicPreview(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const removeProfilePic = () => {
    setProfilePic(null);
    setProfilePicPreview(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  const onSubmit = (data) => {
    const formData = {
      ...data,
      profilePic: profilePic,
    };

    
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <VStack gap={4} py={4}>
        <Field.Root width="100%">
          <Field.Label color="black">Profile Picture</Field.Label>
          <VStack width="100%" gap={2}>
            {profilePicPreview ? (
              <Box position="relative">
                <Image
                  src={profilePicPreview}
                  alt="Profile Preview"
                  boxSize="100px"
                  borderRadius="full"
                  objectFit="cover"
                  border="3px solid"
                  borderColor="teal.300"
                />
                <IconButton
                  aria-label="Remove photo"
                  position="absolute"
                  top="-2"
                  right="-2"
                  size="xs"
                  colorPalette="red"
                  borderRadius="full"
                  onClick={removeProfilePic}
                >
                  <LuX />
                </IconButton>
              </Box>
            ) : (
              <Box
                boxSize="100px"
                borderRadius="full"
                bg="gray.100"
                display="flex"
                alignItems="center"
                justifyContent="center"
                border="2px dashed"
                borderColor="gray.300"
              >
                <LuUpload size={24} color="gray" />
              </Box>
            )}
            <Input
              type="file"
              accept="image/*"
              ref={fileInputRef}
              display="none"
              onChange={handleProfilePicChange}
            />
            <Button
              size="sm"
              variant="outline"
              colorPalette="teal"
              onClick={() => fileInputRef.current?.click()}
            >
              {profilePicPreview ? "Change Photo" : "Upload Photo"}
            </Button>
          </VStack>
        </Field.Root>

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