"use client"
import { signIn, signOut } from "next-auth/react";
import { Button } from "@/components/ui/button";

export function SignIn() {
  return (
    <form
      action={() => {
        signIn();
      }}
    >
      <Button type="submit">Sign in</Button>
    </form>
  );
}

export function SignOut() {
  return (
    <form action={() => {
      signOut();
    }}>
      <Button type="submit">Sign Out</Button>
    </form>
  );
}
