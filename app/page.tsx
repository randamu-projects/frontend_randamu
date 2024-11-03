"use client";

import React from "react";
import { useRouter } from "next/navigation";
import HomeScreen from "~~/components/HomeScreen";

const HomePage: React.FC = () => {
  const router = useRouter();

  const handleGameSelect = (game: string) => {
    router.push(`/${game}`);
  };

  return <HomeScreen onGameSelect={handleGameSelect} />;
};

export default HomePage;
