
import React, { useState } from "react";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { useGame } from "@/contexts/GameContext";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Trophy, Coins } from "lucide-react";

const RankingEntry = ({ position, player, value, type }) => (
  <motion.div
    initial={{ opacity: 0, y: 20 }}
    animate={{ opacity: 1, y: 0 }}
    transition={{ delay: position * 0.1 }}
    className="flex items-center gap-4 bg-gray-800 p-4 rounded-lg"
  >
    <div className="text-2xl font-bold text-yellow-400 w-8">#{position + 1}</div>
    <div className="flex items-center gap-3 flex-1">
      <img
        src={player.avatar}
        alt={player.name}
        className="w-10 h-10 rounded-full bg-gray-700"
      />
      <span className="font-semibold">{player.name}</span>
    </div>
    <div className="flex items-center gap-2 text-lg">
      {value}
      {type === "coins" ? (
        <span className="text-yellow-400">🪙</span>
      ) : (
        <span className="text-blue-400">s</span>
      )}
    </div>
  </motion.div>
);

export default function Ranking() {
  const { setMenuState, globalRanking } = useGame();
  const [activeTab, setActiveTab] = useState("times");

  // Sort players by time (ascending) or coins (descending)
  const sortedByTime = [...globalRanking].sort((a, b) => a.bestTime - b.bestTime);
  const sortedByCoins = [...globalRanking].sort((a, b) => b.coins - a.coins);

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex justify-between items-center mb-8">
        <h2 className="text-3xl font-bold">Ranking Global</h2>
        <Button
          onClick={() => setMenuState("main")}
          className="bg-orange-600 hover:bg-orange-700"
        >
          Volver
        </Button>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="grid w-full grid-cols-2 mb-8">
          <TabsTrigger value="times" className="flex items-center gap-2">
            <Trophy className="w-4 h-4" />
            Mejores Tiempos
          </TabsTrigger>
          <TabsTrigger value="coins" className="flex items-center gap-2">
            <Coins className="w-4 h-4" />
            Más Monedas
          </TabsTrigger>
        </TabsList>

        <TabsContent value="times" className="space-y-4">
          {sortedByTime.map((player, index) => (
            <RankingEntry
              key={player.name}
              position={index}
              player={player}
              value={player.bestTime.toFixed(1)}
              type="time"
            />
          ))}
        </TabsContent>

        <TabsContent value="coins" className="space-y-4">
          {sortedByCoins.map((player, index) => (
            <RankingEntry
              key={player.name}
              position={index}
              player={player}
              value={player.coins}
              type="coins"
            />
          ))}
        </TabsContent>
      </Tabs>
    </div>
  );
}
