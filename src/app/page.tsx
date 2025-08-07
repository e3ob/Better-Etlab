import { SignIn, SignOut } from "@/components/auth";
import Calender from "@/components/calendar-31";
import { auth } from "auth";

export default async function Home() {
  const session = await auth();
  if (!session?.user) return <div className="flex min-h-screen flex-col items-center justify-center">
    <SignIn />
  </div>;
  return (
    <div className="flex min-h-screen flex-col items-center justify-center">
      <Calender user={session.user} />
    </div>
  );
}
