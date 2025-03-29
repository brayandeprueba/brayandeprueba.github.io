
import React from "react";
import { AnimatePresence } from "framer-motion";
import { Toaster } from "@/components/ui/toaster";
import GameProvider from "@/contexts/GameContext";
import Router from "@/components/Router";

function App() {
  return (
    <GameProvider>
      <div className="min-h-screen bg-gradient-to-b from-gray-900 to-gray-800 text-white">
        <AnimatePresence mode="wait">
          <Router />
        </AnimatePresence>
        <Toaster />
      </div>
    </GameProvider>
  );
}

export default App;
