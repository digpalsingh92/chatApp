 "use client";

import dynamic from "next/dynamic";

const ChatsPage = dynamic(() => import("@/pages/Chats/ChatsPage"), {
  ssr: false,
});

const Page = () => {
  return <ChatsPage />;
};

export default Page;