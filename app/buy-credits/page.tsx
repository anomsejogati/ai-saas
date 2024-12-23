"use client";
import React, { useState } from "react";
import { PayPalButtons, usePayPalScriptReducer } from "@paypal/react-paypal-js";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import toast from "react-hot-toast";
import { saveCredit } from "@/actions/credit";
import Loader from "@/components/loader";
import { useImage } from "@/context/image";

const creditOptions = [
  { credits: 10, price: 5 },
  { credits: 20, price: 10 },
  { credits: 50, price: 20 },
];

export default function BuyCredits() {
  const [{ isPending }] = usePayPalScriptReducer();
  const [selected, setSelected] = useState(creditOptions[0]);
  const { credits, getUserCredits } = useImage();

  const handleSuccess = async (details: any) => {
    const amount = parseFloat(details.purchase_units[0].amount.value);
    const credits = parseInt(details.purchase_units[0].custom_id, 10);

    // save credit to db
    try {
      await saveCredit(amount, credits);
      getUserCredits();
      toast.success(`Successfully purchased ${credits} credits.`);
    } catch (error) {
      console.log(">> Error on handleSuccess: ", error);
      toast.error("An error occured. Please try again.");
    }
  };

  const handleError = (error: any) => {
    console.log(">> Error on handleError: ", error);
    toast.error("An error occured. Please try again.");
  };

  if (isPending) return <Loader />;

  return (
    <div className="container mx-auto p-4">
      <Card className="w-full max-w-md mx-auto">
        <CardHeader>
          <CardTitle className="text-2xl font-bold text-center">
            Buy Credits
          </CardTitle>
          <p className="text-center">
            You currently have{" "}
            <span className="font-bold text-primary">{credits}</span> credits.
          </p>
        </CardHeader>

        <CardContent>
          <div className="flex flex-col gap-2 justify-between mb-6">
            {creditOptions.map((option) => (
              <Button
                key={option.credits}
                onClick={() => setSelected(option)}
                variant={
                  selected.credits === option.credits ? "default" : "outline"
                }
                className="h-10"
              >
                {option.credits} Credits - ${option.price}
              </Button>
            ))}
          </div>

          <div className="relative z-0">
            <PayPalButtons
              key={selected.credits}
              createOrder={(data, actions: any) => {
                const price = selected.price.toFixed();
                const credits = selected.credits.toString();

                return actions.order.create({
                  purchase_units: [
                    {
                      amount: {
                        currency_code: "USD",
                        value: price,
                      },
                      custom_id: credits,
                    },
                  ],
                });
              }}
              onApprove={async (DataTransfer, actions: any) => {
                const details = await actions.order.capture();
                handleSuccess(details);
              }}
              onError={handleError}
            />
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
