"use client";
import React from "react";
import toast, { Toast } from "react-hot-toast";
import { generateImageAI } from "@/actions/image";
import { useUser } from "@clerk/nextjs";
import { useRouter } from "next/router";
import {
  getUserCredits as getUserCreditsFromDB,
  checkCreditRecordDB,
} from "@/actions/credit";

// context type
interface ImageType {
  imageUrl: string;
}

// context value type
interface ImageContextType {
  imagePrompt: string;
  setImagePrompt: (query: string) => void;
  loading: boolean;
  setLoading: React.Dispatch<React.SetStateAction<boolean>>;
  generateImage: () => void;
  credits: number;
  setCredits: React.Dispatch<React.SetStateAction<number>>;
  getUserCredits: () => void;
}

// create context
const ImageContext = React.createContext<ImageContextType | undefined>(
  undefined
);

// create provider component
export const ImageProvider = ({ children }: { children: React.ReactNode }) => {
  // state
  const [imagePrompt, setImagePrompt] = React.useState("");
  const [loading, setLoading] = React.useState(false);
  const [credits, setCredits] = React.useState(0);

  const { isSignedIn } = useUser();

  React.useEffect(() => {
    getUserCredits();
  }, []);

  React.useEffect(() => {
    checkCreditRecordDB();
  }, []);

  const getUserCredits = () => {
    getUserCreditsFromDB().then((credit) => setCredits(credit?.credits));
  };

  // functions
  const generateImage = async () => {
    setLoading(true);

    if (!isSignedIn) toast.loading("Please sigin in to generate image");

    try {
      const router = useRouter();
      const { success, _id, credits } = await generateImageAI(imagePrompt);

      if (success) {
        setCredits(credits);
        toast.success("🎉 Image generated.");
        router.push(`/dashboard/image/${_id}`);
      } else {
        setCredits(credits);
        toast.error(
          "Insufficient credits. Please buy more credits to generate image."
        );
        router.push(`/buy-credits`);
      }
    } catch (error) {
      toast.error("Failed to generate image");
    }
  };

  return (
    <ImageContext.Provider
      value={{
        imagePrompt,
        setImagePrompt,
        loading,
        setLoading,
        generateImage,
        credits,
        setCredits,
        getUserCredits,
      }}
    >
      {children}
    </ImageContext.Provider>
  );
};

// export useImage hook
export const useImage = (): ImageContextType => {
  const context = React.useContext(ImageContext);
  if (context === undefined) {
    throw new Error("useImage must be used within a ImageProvider");
  }

  return context;
};
