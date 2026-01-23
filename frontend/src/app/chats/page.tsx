import { checkLoggedOut } from "@/utils/checkAuth";
import ChatsPage from "@/pages/Chats/ChatsPage";

const Page = async () => {
  await checkLoggedOut();
  return <ChatsPage />;
};

export default Page;
