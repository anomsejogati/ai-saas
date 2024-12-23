"use server";
import Credit from "@/models/credit";
import db from "@/utils/db";
import { currentUser } from "@clerk/nextjs/server";

export const saveCredit = async (amount: number, credits: number) => {
  try {
    await db();
    const user = await currentUser();
    const userEmail = user?.emailAddresses[0]?.emailAddress;

    // check if the user already has a credit record
    const existingCredit = await Credit.findOne({ userEmail });
    if (existingCredit) {
      // add to the existing credit
      existingCredit.amount += amount;
      existingCredit.credits += credits;
      await existingCredit.save();

      return JSON.parse(JSON.stringify(existingCredit));
    } else {
      // create
      const newCredit = await new Credit({
        userEmail,
        amount,
        credits,
      }).save();

      return JSON.parse(JSON.stringify(newCredit));
    }
  } catch (error) {
    console.log(">> 🔴 Error on saveCredit: ", error);
  }
};

export const getUserCredits = async () => {
  try {
    await db();
    const user = await currentUser();
    const userEmail = user?.emailAddresses[0]?.emailAddress;

    const credit = await Credit.findOne({ userEmail });

    return JSON.parse(JSON.stringify(credit));
  } catch (error) {
    console.log(">> 🔴 Error on getCreditUser: ", error);
  }
};

export const checkCreditRecordDB = async () => {
  try {
    await db();
    const user = await currentUser();
    const userEmail = user?.emailAddresses[0]?.emailAddress;

    const credit = await Credit.findOne({ userEmail });

    if (!credit) {
      const newCredit = await new Credit({
        userEmail,
        amount: 0,
        credits: 5,
      }).save();
    }
  } catch (error) {
    console.log(">> 🔴 Error on checkCreditRecordDB: ", error);
  }
};
