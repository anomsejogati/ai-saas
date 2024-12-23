"use client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useImage } from "@/context/image";
import { Loader2Icon } from "lucide-react";

export default function GenerateImageInput() {
  const { generateImage, imagePrompt, setImagePrompt, loading } = useImage();

  return (
    <form onSubmit={generateImage}>
      <div className="mt-5 flex space-x-2">
        <Input
          placeholder="Final Fantasy"
          value={imagePrompt}
          onChange={(e) => setImagePrompt(e.target.value)}
          className="p-6 lg:p-8 text-xl lg:text-2xl placeholder:text-xl lg:placeholder:text-2xl"
        />
        <Button
          className="p-6 lg:p-8 text-lg lg:text-2xl"
          onClick={generateImage}
          disabled={loading}
        >
          {loading ? (
            <Loader2Icon className="animate-spin mr-2" />
          ) : (
            "Generate Image"
          )}
        </Button>
      </div>
    </form>
  );
}
