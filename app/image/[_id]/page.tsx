import React from "react";
import Image from "next/image";
import ImageCard from "@/components/cards/image-card";
import { getImageFromDB } from "@/actions/image";

interface ImagePageProps {
  params: Promise<{ _id: string }>;
}

export default async function ImagePage({ params }: ImagePageProps) {
  const { _id } = await params;

  const image = await getImageFromDB(_id);

  return (
    <div>
      <div className="flex flex-row justify-center items-center mt-20">
        <ImageCard image={image} />
      </div>

      <div className="flex flex-row justify-center items-center">
        <div className="relative w-full h-[75vh] my-20">
          <Image
            src={image.url}
            alt={image.name}
            layout="fill"
            className="object-contain"
          />
        </div>
      </div>
    </div>
  );
}
