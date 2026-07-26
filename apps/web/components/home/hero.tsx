import React from "react";
import Text from "../ui/Text";

export const Hero = () => {
  return (
    <section className="min-h-[calc(100vh-150px)] w-full flex items-center justify-center">
      <Text
        as="h1"
        size="6xl"
        color="primary"
        family="heading"
        weight="semibold"
      >
        Edit PDFs <br />
        just by{" "}
        <Text
          as="span"
          size="6xl"
          color="primary"
          weight="bold"
          family="sans"
        >
          Asking.
        </Text>
      </Text>
    </section>
  );
};