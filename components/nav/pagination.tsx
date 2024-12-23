import React from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { ChevronRight, ChevronLeft } from "lucide-react";

interface PaginationProps {
  page: number;
  totalPages: number;
}

export default function Pagination({ page, totalPages }: PaginationProps) {
  return (
    <nav className="flex jutify-center fixed-bottom opacity-75 mb-10">
      <ul className="flex justify-center items-center space-x-2 mt-5">
        {page > 1 && (
          <li>
            <Link href={`?page=${page - 1}`}>
              <Button variant="ghost">
                <ChevronLeft />
              </Button>
            </Link>
          </li>
        )}

        {Array.from({ length: totalPages }, (_, i) => {
          const p = i + 1;
          return (
            <li>
              <Link href={`?page=${p}`}>
                <Button variant={`${page == p ? "secondary" : "ghost"}`}>
                  {p}
                </Button>
              </Link>
            </li>
          );
        })}

        {page > totalPages && (
          <li>
            <Link href={`?page=${page + 1}`}>
              <Button variant="ghost">
                <ChevronRight />
              </Button>
            </Link>
          </li>
        )}
      </ul>
    </nav>
  );
}
