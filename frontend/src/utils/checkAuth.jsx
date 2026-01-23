import { cookies } from "next/headers";
import { redirect } from "next/navigation";

export const checkLoggedOut = async () => {
  const cookieStore = await cookies();
  const adminToken = cookieStore.get("token");
  if (!adminToken?.value) {
    redirect("/");
  }
};
