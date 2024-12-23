"use client";
import React, { useState, useEffect } from "react";
import { Coins } from "lucide-react";
import { useImage } from "@/context/image";

export default function Credits() {
  const [total, setTotal] = useState(0);
  const { credits } = useImage();

  const displayCredits = credits > 99 ? "99+" : credits?.toString();
  const badgeColor = credits < 10 ? "bg-red-500" : "bg-green-500";

  return (
    <div className="relative inline-block">
      <Coins className="h-8 w-8 text-[#6a5acd]" />
      <div
        className={`absolute -top-1 -right-2 ${badgeColor} text-white text-[10px] font-bold rounded-full flex items-center justify-center px-1`}
      >
        {displayCredits}
      </div>
    </div>
  );
}
