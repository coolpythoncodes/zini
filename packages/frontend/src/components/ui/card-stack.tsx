"use client";
import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { Icons } from "../common/icons";
import { cn } from "@/lib/utils";

let interval: unknown;

type Card = {
  id: number;
  text: string;
  value: string;
  className?: string;
};

export const CardStack = ({
  items,
  offset,
  scaleFactor,
}: {
  items: Card[];
  offset?: number;
  scaleFactor?: number;
}) => {
  const CARD_OFFSET = offset ?? 10;
  const SCALE_FACTOR = scaleFactor ?? 0.06;
  const [cards, setCards] = useState<Card[]>(items);

  useEffect(() => {
    startFlipping();
    // @ts-expect-error unknown error
    return () => clearInterval(interval);
  }, []);
  const startFlipping = () => {
    interval = setInterval(() => {
      setCards((prevCards: Card[]) => {
        const newArray = [...prevCards]; // create a copy of the array
        newArray.unshift(newArray.pop()!); // move the last element to the front
        return newArray;
      });
    }, 5000);
  };

  return (
    <div className="relative h-60 w-full md:h-60 md:w-96">
      {cards.map((card, index) => {
        return (
          <motion.div
            key={card.id}
            className={cn(
              "absolute flex h-60 w-full flex-col justify-between rounded-3xl border border-neutral-200 bg-white p-4 shadow-xl shadow-black/[0.1] dark:border-white/[0.1] dark:bg-black dark:shadow-white/[0.05] md:h-60",
              card?.className,
            )}
            style={{
              transformOrigin: "top center",
            }}
            animate={{
              top: index * -CARD_OFFSET,
              scale: 1 - index * SCALE_FACTOR, // decrease scale for cards that are behind
              zIndex: cards.length - index, //  decrease z-index for the cards that are behind
            }}
          >
            <Icons.simCard />
            <div className="grid h-full place-items-center">
              <div className="text-center text-white">
                <p className="text-base font-medium leading-[18px]">
                  {card.text}
                </p>
                <p className="text-4xl font-semibold leading-9">
                  {card?.value}
                </p>
              </div>
            </div>

            <Icons.masterCard className="ml-auto w-fit" />
          </motion.div>
        );
      })}
    </div>
  );
};
