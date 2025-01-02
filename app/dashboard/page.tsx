import React from "react";
import { getUserImagesFromDb } from "@/actions/image";
import { ImageType } from "@/utils/types/images";
import Link from "next/link";
import ImageCard from "@/components/cards/image-card";
import Pagination from "@/components/nav/pagination";

interface DashboardProps {
  searchParams: Promise<{ page?: number }>;
}

export default async function Dashboard({ searchParams }: DashboardProps) {
  const { page: initPage } = await searchParams;
  const page = initPage ? parseInt(initPage as unknown as string, 10) : 1;
  const limit = 3;

  const { images, totalCount } = await getUserImagesFromDb(page, limit);

  const totalPages = Math.ceil(totalCount / limit);

  return (
    <div>
      <div className="p-5 text-center">
        <h1 className="text-2xl font-bold text-center">Images</h1>
        <p>Your AI-Generated Image Collections</p>
      </div>

      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-5">
        {images.map((image: ImageType) => {
          <Link href={`/dashboard/image/${image._id}`}>
            <ImageCard image={image} />
          </Link>;
        })}
      </div>

      <div className="flex justify-center m-20">
        <Pagination page={page} totalPages={totalPages} />
      </div>
    </div>
  );
}
