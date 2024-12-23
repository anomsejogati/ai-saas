import React from "react";
import Image from "next/image";
import ImageEditButton from "@/components/image/image-edit-button";
import { getImageFromDB } from "@/actions/image";

interface ImageProps {
  params: {
    _id: string;
  };
}

export default async function ImagePage({ params }: ImageProps) {
  const image = await getImageFromDB(params._id);

  return (
    <div className="flex flex-col max-w-4xl mx-auto justify-center items-center p-4">
      <div className="relative w-full h-[60vh] mb-8">
        <Image
          src={image.url}
          alt={image.name}
          layout="fill"
          className="rounded-lg object-contain"
        />
      </div>
      <div>
        <ImageEditButton image={image} />
      </div>
    </div>
  );
}
