import { Button } from "@/components/ui/button";
import GenerateImageInput from "@/components/forms/generate-image-input";
import HeroImageSlider from "@/components/display/hero-image-slider";

export default function Home() {
  return (
    <div className="flex items-center justify-center m-5">
      <div className="grid max-w-4xl">
        <div className="my-10">
          <h1 className="text-7xl lg:text-9xl font-bold mb-2">
            <span className="text-8lx bg-gradient-to-r from-blue-500 via-purple-500 to-red-500 text-transparent bg-clip-text animate-pulse">
              AI
            </span>
            <br />
            Image Generator
          </h1>
          <p>
            Lorem ipsum dolor sit amet consectetur adipisicing elit. Maxime ipsa
            itaque quia fuga inventore nisi cum aspernatur, sunt quibusdam
            perspiciatis nam vel a quo assumenda laboriosam mollitia et hic
            odit?
          </p>
          <GenerateImageInput />
        </div>

        <div className="relative">
          <HeroImageSlider />
        </div>
      </div>
    </div>
  );
}
