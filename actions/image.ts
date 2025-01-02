"use server";
import { auth, currentUser } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";
import Replicate from "replicate";
import { writeFile } from "node:fs/promises";
import { v2 as cloudinary } from "cloudinary";
import { nanoid } from "nanoid";
import { resolve } from "node:path";
import db from "@/utils/db";
import Image from "@/models/image";
import Credit from "@/models/credit";

const replicate = new Replicate({
  auth: process.env.REPLICATE_API_TOKEN,
});

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

export async function generateImageAI(imagePrompt: string) {
  // to redirect user to login page if not signed in
  const user = await currentUser();
  if (!user) (await auth()).redirectToSignIn();

  const userEmail = user?.emailAddresses[0]?.emailAddress;
  const userName = user?.fullName;

  try {
    // connect to db
    await db();

    // 1. check if user has enough credit
    const userCredit = await Credit.findOne({ userEmail });
    if (!userCredit || userCredit.credits < 1) {
      return {
        success: false,
        _id: null,
        credits: userCredit?.credits,
      };
    }

    // 2. reduce the credit by 1
    userCredit.credits -= 1;
    await userCredit.save();

    // generate image with ai
    const input = {
      prompt: imagePrompt,
      output_format: "png",
      output_quality: 80,
      aspect_ratio: "16:9",
    };

    const output: any = await replicate.run("black-forest-labs/flux-schnell", {
      input,
    });

    // conert the stream to a buffer
    const respose = await fetch(output[0]);
    const buffer = await respose.arrayBuffer();
    const nodeBuffer = Buffer.from(buffer);
    // for (const [index, item] of Object.entries(output)) {
    //   await writeFile(`output_${index}.webp`, item);
    // }

    // upload the buffer to cloudinary
    const uploadResponse: any = await new Promise((resolve, reject) => {
      const uploadStream = cloudinary.uploader.upload_stream(
        {
          folder: "ai_images",
          public_id: nanoid(),
        },
        (error, result) => {
          if (error) reject(error);
          else resolve(result);
        }
      );

      uploadStream.end(nodeBuffer);
    });

    const cloudinaryUrl = uploadResponse.secure_url;

    // save image to db
    const image = await new Image({
      userEmail,
      userName,
      name: imagePrompt,
      url: cloudinaryUrl,
    }).save();

    return {
      success: true,
      _id: image._id,
      credits: userCredit?.credits,
    };
  } catch (error: any) {
    throw new Error(error);
    redirect("/");
  }
}

export const getUserImagesFromDb = async (page: number, limit: number) => {
  try {
    await db();
    const user = await currentUser();
    const userEmail = user?.emailAddresses[0]?.emailAddress;

    const [images, totalCount] = await Promise.all([
      Image.find({ userEmail })
        .sort({ createdAt: -1 })
        .skip((page - 1) * limit)
        .limit(limit),
      Image.countDocuments({ userEmail }),
    ]);

    return {
      images: JSON.parse(JSON.stringify(images)),
      totalCount,
    };
  } catch (error: any) {
    throw new Error(error);
  }
};

export const getImageFromDB = async (_id: string) => {
  try {
    await db();

    const [image] = await Promise.all([Image.findById(_id)]);

    return JSON.parse(JSON.stringify(image));
  } catch (error: any) {
    throw new Error(error);
  }
};
