import { SignIn, SignOut } from "@/components/auth";
import Calender from "@/components/calendar-31";
import Survey from "@/components/survey";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { auth } from "auth";
import { Github } from "lucide-react";
import Link from "next/link";

export default async function Home() {
  const session = await auth();
  if (!session?.user)
    return (
      <div className="flex min-h-screen flex-col items-center justify-center">
        <SignIn />
      </div>
    );
  return (
    <div className="flex flex-col items-center justify-center">
      <Card className="w-full max-w-sm pb-2 ">
        <Tabs defaultValue="survey">
          <CardHeader>
            <CardTitle className="flex items-center justify-between">
              <span>{session.user.profile_name} Logged in</span>
              <SignOut />
            </CardTitle>
            <CardDescription className="text-sm text-muted-foreground">
              <TabsList>
                <TabsTrigger value="survey">Survey</TabsTrigger>
                <TabsTrigger value="calendar">Calendar</TabsTrigger>
              </TabsList>
            </CardDescription>
          </CardHeader>
          <CardContent>
            <TabsContent value="survey">
              <Survey user={session.user} />
            </TabsContent>
            <TabsContent value="calendar">
              <div className="flex min-h-full flex-col items-center justify-center">
                {/* <Calender user={session.user} /> */}
                Currently under development. Please check back later.
              </div>
            </TabsContent>
          </CardContent>
          <CardFooter className="flex flex-col items-center justify-center">
            <Link
              className="text-sm text-muted-foreground"
              href="https://github.com/e3ob/Better-Etlab"
            >
              Source Code <Github className="inline h-4 w-4" />
            </Link>
          </CardFooter>
        </Tabs>
      </Card>
    </div>
  );
}
