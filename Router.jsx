
import React from "react";
import { motion } from "framer-motion";
import { useGame } from "@/contexts/GameContext";
import MainMenu from "@/components/MainMenu";
import Options from "@/components/Options";
import GameBoard from "@/components/GameBoard";
import Store from "@/components/Store";

const pageVariants = {
  initial: { opacity: 0, y: 20 },
  animate: { opacity: 1, y: 0 },
  exit: { opacity: 0, y: -20 }
};

export default function Router() {
  const { gameMode, menuState } = useGame();

  const renderContent = () => {
    if (gameMode === "menu") {
      if (menuState === "store") return <Store />;
      if (menuState === "options") return <Options />;
      if (menuState === "modes" || menuState === "main") return <MainMenu />;
    }
    
    if (["normal", "competitive", "sumamos", "contrarreloj", "mirror", "extreme"].includes(gameMode)) {
      return <GameBoard />;
    }
    
    return <MainMenu />;
  };

  return (
    <motion.div
      initial="initial"
      animate="animate"
      exit="exit"
      variants={pageVariants}
      transition={{ duration: 0.3 }}
      className="container mx-auto px-4 py-8"
    >
      {renderContent()}
    </motion.div>
  );
}
