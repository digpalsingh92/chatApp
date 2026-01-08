"use client";
import {
  Avatar,
  Box,
  Button,
  Flex,
  Input,
  Text,
  Spinner,
} from "@chakra-ui/react";
import { useRef, useState } from "react";
import { useForm } from "react-hook-form";
import { toaster } from "@/components/ui/toaster";
import { getToken } from "@/utils/helper";
import axios from "axios";
import { useRouter } from "next/navigation";
import { BiLeftArrowAlt } from "react-icons/bi";
import { useEffect } from "react";


const MyProfilePage = () => {
  const fileInputRef = useRef(null);
  const [preview, setPreview] = useState(null);
  const [file, setFile] = useState(null);
  const [loading, setLoading] = useState(false);
  const [user, setUser] = useState(null);
  const router = useRouter();
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm({
    defaultValues: {
      name: "",
      email: "",
    },
  });

  const handleImageChange = (e) => {
    const selectedFile = e.target.files?.[0];
    if (!selectedFile) return;

    setFile(selectedFile);
    setPreview(URL.createObjectURL(selectedFile));
  };

  useEffect(() => {
    const fetchUserProfile = async () => {
      try {
        const res = await axios.get(
          `${process.env.NEXT_PUBLIC_WEB_URL}/api/user/me`,
          {
            headers: {
              Authorization: `Bearer ${getToken()}`,
            },
          }
        );
  
        setUser(res.data.user);
        reset({
          name: res.data.user?.name || "",
          email: res.data.user?.email || "",
        });
  
        if (res.data.user?.pic) {
          setPreview(res.data.user.pic);
        }
      } catch (err) {
        console.error("Failed to fetch profile", err);
      }
    };
  
    fetchUserProfile();
  }, []);

  const onSubmit = async (data) => {
    try {
      setLoading(true);
  
      const formData = new FormData();
      formData.append("name", data.name);
      formData.append("email", data.email);
  
      if (file) {
        formData.append("image", file);
      }
  
      const res = await axios.put(`${process.env.NEXT_PUBLIC_WEB_URL}/api/profile`, formData, {
        headers: {
          Authorization: `Bearer ${getToken()}`,
          "Content-Type": "multipart/form-data",
        },
      });
  
      toaster.create({
        title: "Profile updated",
        description: res.data.message,
        type: "success",
        duration: 3000,
      });
      router.refresh();
    } catch (err) {
      toaster.create({
        title: "Something went wrong",
        description:
          err.response?.data?.message || err.message || "Failed to update profile",
        type: "error",
        duration: 3000,
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <Flex minH="100vh" bg="gray.50" align="center" justify="center" p={4}>
      <Box bg="white" w="100%" maxW="420px" p={6} borderRadius="xl" boxShadow="lg">
        <BiLeftArrowAlt onClick={() => router.back()} />
        <Text fontSize="2xl" fontWeight="bold" textAlign="center" mb={6}>
          My Profile
        </Text>

        <Flex direction="column" align="center" mb={6}>
          <Avatar.Root size="2xl">
            <Avatar.Fallback name="User" />
            <Avatar.Image
              src={
                preview ||
                "https://icon-library.com/images/anonymous-avatar-icon/anonymous-avatar-icon-25.jpg"
              }
            />
          </Avatar.Root>

          <Button
            mt={3}
            size="sm"
            colorScheme="teal"
            onClick={() => fileInputRef.current?.click()}
          >
            Change Photo
          </Button>

          <Input
            type="file"
            ref={fileInputRef}
            accept="image/*"
            display="none"
            onChange={handleImageChange}
          />
        </Flex>

        <form onSubmit={handleSubmit(onSubmit)}>
          <Flex direction="column" gap={4}>
            <Box>
              <Text fontSize="sm" color="gray.500" mb={1}>
                Full Name
              </Text>
              <Input
                placeholder="Enter your name"
                {...register("name", { required: "Name is required" })}
              />
              {errors.name && (
                <Text fontSize="xs" color="red.500">
                  {errors.name.message}
                </Text>
              )}
            </Box>

            <Box>
              <Text fontSize="sm" color="gray.500" mb={1}>
                Email
              </Text>
              <Input
                placeholder="Enter your email"
                {...register("email", {
                  required: "Email is required",
                })}
              />
              {errors.email && (
                <Text fontSize="xs" color="red.500">
                  {errors.email.message}
                </Text>
              )}
            </Box>

            <Button
              type="submit"
              mt={2}
              backgroundColor="teal.500"
              color="white"
              _hover={{ backgroundColor: "teal.600" }}
              disabled={loading}
            >
              {loading ? <Spinner size="sm" /> : "Save Changes"}
            </Button>
          </Flex>
        </form>
      </Box>
    </Flex>
  );
};

export default MyProfilePage;
