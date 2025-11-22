import { SignIn, SignOut } from "@/components/auth";
import Calender from "@/components/calendar-31";
import Survey from "@/components/survey";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { auth } from "auth";

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
      <Card className="w-full max-w-sm">
        <Tabs defaultValue="survey">
          <CardHeader>
            <CardTitle className="flex items-center justify-between">
              <span>{session.user.profile_name} Logged in</span>
              <SignOut />
            </CardTitle>
            <CardDescription className="text-sm text-muted-foreground">
              {/* View your attendance records for the selected date. */}
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
        </Tabs>
      </Card>
    </div>
  );
}
