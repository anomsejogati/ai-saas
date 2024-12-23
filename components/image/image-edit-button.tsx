import React from "react";
import { ImageType } from "@/utils/types/images";
import { Button } from "@/components/ui/button";
import { CloudDownload, SquareArrowOutUpRight, View } from "lucide-react";
import Link from "next/link";
import { saveAs } from "file-saver";
import toast from "react-hot-toast";

export default function ImageEditButton({ image }: { image: ImageType }) {
  const handleDownload = () => {
    saveAs(image.url, `${image.name}.png`);
  };

  const handleShare = async () => {
    const currentUrl = `${window.location.origin}/image/${image._id}`;
    try {
      await navigator.clipboard.writeText(currentUrl);
      toast.success("URL copied to clipboard. Share with your friends!");
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <div className="flex justify-center gap-4">
      <Button
        onClick={handleDownload}
        className="h-16 w-16 lg:h-20 lg:w-20 flex flex-col items-center justify-center"
      >
        <CloudDownload className="h-6 w-6 mb-1" />{" "}
        <span className="text-sm">Download</span>
      </Button>

      <Button
        onClick={handleShare}
        className="h-16 w-16 lg:h-20 lg:w-20 flex flex-col items-center justify-center"
      >
        <SquareArrowOutUpRight className="h-6 w-6 mb-1" />{" "}
        <span className="text-sm">Share</span>
      </Button>

      <Link href={`/image/${image._id}`}>
        <Button className="h-16 w-16 lg:h-20 lg:w-20 flex flex-col items-center justify-center">
          <View className="h-6 w-6 mb-1" />{" "}
          <span className="text-sm">View</span>
        </Button>
      </Link>
    </div>
  );
}
