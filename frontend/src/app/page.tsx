"use client";
import Login from "@/pages/Login";
import Signup from "@/pages/Signup";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";

export default function Home() {
  return (
    <div className="max-w-xl mx-auto">
      <div className="flex justify-center p-3 bg-white w-full m-[40px_0_15px_0] rounded-lg border border-white">
        <h1 className="text-4xl text-black">Chat</h1>
      </div>
      <div className="bg-white w-full p-4 rounded-lg border border-white">
        <Tabs defaultValue="login">
          <TabsList className="w-full flex justify-center items-center">
            <TabsTrigger value="login" className="w-[50%] text-center">
              Login
            </TabsTrigger>
            <TabsTrigger value="signup" className="w-[50%] text-center">
              Signup
            </TabsTrigger>
          </TabsList>
          <TabsContent value="login">
            <Login />
          </TabsContent>
          <TabsContent value="signup">
            <Signup />
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}
