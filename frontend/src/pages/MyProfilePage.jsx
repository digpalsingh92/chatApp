"use client";
import { useRef, useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { toaster } from "@/components/ui/toast";
import { getToken } from "@/utils/helper";
import axios from "axios";
import { useRouter } from "next/navigation";
import { BiLeftArrowAlt } from "react-icons/bi";
import { generateAvatar } from "@/utils/helper";
import { Avatar } from "@/components/ui/avatar";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Spinner } from "@/components/ui/spinner";
import { Label } from "@/components/ui/label";
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
} from "@/components/ui/dropdown-menu";

const MyProfilePage = () => {
  const fileInputRef = useRef(null);
  const [preview, setPreview] = useState(null);
  const [file, setFile] = useState(null);
  const [loading, setLoading] = useState(false);
  const [user, setUser] = useState(null);
  const [avatarType, setAvatarType] = useState("image");
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
    setAvatarType("image");
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

      if (avatarType === "image" && file) {
        formData.append("image", file);
      }

      if (avatarType === "avatar" && preview) {
        formData.append("avatarUrl", preview);
      }

      const res = await axios.put(
        `${process.env.NEXT_PUBLIC_WEB_URL}/api/profile`,
        formData,
        {
          headers: {
            Authorization: `Bearer ${getToken()}`,
          },
        }
      );

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
        description: err.response?.data?.message || err.message,
        type: "error",
        duration: 3000,
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
      <div className="bg-white w-full max-w-[420px] p-6 rounded-xl shadow-lg">
        <BiLeftArrowAlt
          onClick={() => router.back()}
          className="cursor-pointer mb-4"
          size={24}
        />
        <h2 className="text-2xl font-bold text-center mb-6">My Profile</h2>

        <div className="flex flex-col items-center mb-6">
          <Avatar
            size="2xl"
            src={
              preview ||
              "https://icon-library.com/images/anonymous-avatar-icon/anonymous-avatar-icon-25.jpg"
            }
            alt="User"
            className="mb-3"
          />

          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button size="sm" className="mt-3">
                Change Photo
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent>
              <DropdownMenuItem
                onClick={() => fileInputRef.current?.click()}
              >
                Upload Image
              </DropdownMenuItem>
              <DropdownMenuItem
                onClick={() => {
                  const avatar = generateAvatar(user?.name || "User");
                  setPreview(avatar);
                  setFile(null);
                  setAvatarType("avatar");
                }}
              >
                Choose Avatar
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>

          <input
            type="file"
            ref={fileInputRef}
            accept="image/*"
            className="hidden"
            onChange={handleImageChange}
          />
        </div>

        <form onSubmit={handleSubmit(onSubmit)}>
          <div className="flex flex-col gap-4">
            <div>
              <Label className="text-sm text-gray-500 mb-1">Full Name</Label>
              <Input
                placeholder="Enter your name"
                {...register("name", { required: "Name is required" })}
              />
              {errors.name && (
                <p className="text-xs text-red-500 mt-1">{errors.name.message}</p>
              )}
            </div>

            <div>
              <Label className="text-sm text-gray-500 mb-1">Email</Label>
              <Input
                placeholder="Enter your email"
                {...register("email", {
                  required: "Email is required",
                })}
              />
              {errors.email && (
                <p className="text-xs text-red-500 mt-1">{errors.email.message}</p>
              )}
            </div>

            <Button
              type="submit"
              className="mt-2"
              disabled={loading}
            >
              {loading ? <Spinner size="sm" /> : "Save Changes"}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default MyProfilePage;
