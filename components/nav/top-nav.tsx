import React from "react";
import Link from "next/link";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { SignInButton, SignedIn, SignedOut, UserButton } from "@clerk/nextjs";
import { LogIn, LaptopMinimal, Bot, LucideIcon } from "lucide-react";
import { Toaster } from "react-hot-toast";
import { currentUser } from "@clerk/nextjs/server";
import ModeToggle from "./mod-toggle";
import Credits from "./credits";

interface IconWithTextProps {
  href: string;
  icon: LucideIcon;
  text: string;
}

// Update the IconWithText component to include cursor-pointer
const IconWithText: React.FC<IconWithTextProps> = ({
  href,
  icon: Icon,
  text,
}) => (
  <Link href={href}>
    <div className="flex flex-col items-center cursor-pointer">
      <Icon className="h-10 w-10 text-[#6a5acd]" />
      <span className="text-xs text-gray-500 mt-1 cursor-pointer">{text}</span>
    </div>
  </Link>
);

export default async function TopNav() {
  const user = await currentUser();

  return (
    <div className="flex items-center justify-center p-5 shadow space-x-10">
      <Toaster />

      <div className="text-2xl font-bold">
        <Link href={"/"}>
          <Image
            src="/logos/logo.svg"
            alt="ai image generator logo"
            width={40}
            height={40}
          />
        </Link>
      </div>

      {user && (
        <IconWithText href="/dashboard" icon={LaptopMinimal} text="Dashboard" />
      )}

      <IconWithText href="/chat" icon={Bot} text="Chat" />

      {user && (
        <div className="flex flex-col items-center cursor-pointer">
          <Link href="/buy-credits">
            <Credits />
          </Link>
          <span className="text-xs text-gray-500 mt-1 cursor-pointer">
            Credits
          </span>
        </div>
      )}

      <div className="flex flex-col items-center cursor-pointer">
        <SignedOut>
          <SignInButton>
            <LogIn className="h-9 w-9 text-[#6a5acd] cursor-pointer" />
          </SignInButton>
        </SignedOut>
        <SignedIn>
          <div className="flex justify-center h-10 w-10">
            <UserButton />
          </div>
        </SignedIn>
        <span className="text-xs text-gray-500 mt-1 cursor-pointer">
          Account
        </span>
      </div>

      <div className="flex">
        <ModeToggle />
      </div>
    </div>
  );
}
