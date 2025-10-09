import { redirect } from "next/navigation";
import { getSession } from "@/lib/auth";

export default async function ServiceLayout({ children }) {
  const session = await getSession();
  if (!session) {
    redirect("/login");
  }

  return <>{children}</>;
}
