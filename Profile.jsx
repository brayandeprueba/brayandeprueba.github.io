
import React, { useState } from "react";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useGame } from "@/contexts/GameContext";
import { useToast } from "@/components/ui/use-toast";

const AVATARS = [
  "https://api.dicebear.com/7.x/adventurer/svg?seed=1",
  "https://api.dicebear.com/7.x/adventurer/svg?seed=2",
  "https://api.dicebear.com/7.x/adventurer/svg?seed=3",
  "https://api.dicebear.com/7.x/adventurer/svg?seed=4",
  "https://api.dicebear.com/7.x/adventurer/svg?seed=5",
  "https://api.dicebear.com/7.x/adventurer/svg?seed=6",
  "https://api.dicebear.com/7.x/adventurer/svg?seed=7",
  "https://api.dicebear.com/7.x/adventurer/svg?seed=8",
  "https://api.dicebear.com/7.x/adventurer/svg?seed=9",
  "https://api.dicebear.com/7.x/adventurer/svg?seed=10"
];

export default function Profile() {
  const { setMenuState, playerName, setPlayerName, playerAvatar, setPlayerAvatar } = useGame();
  const { toast } = useToast();
  const [tempName, setTempName] = useState(playerName);

  const handleSave = () => {
    if (tempName.trim().length < 3) {
      toast({
        title: "Nombre inválido",
        description: "El nombre debe tener al menos 3 caracteres",
        variant: "destructive"
      });
      return;
    }
    setPlayerName(tempName);
    toast({
      title: "Perfil actualizado",
      description: "Los cambios han sido guardados"
    });
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex justify-between items-center mb-8">
        <h2 className="text-3xl font-bold">Perfil</h2>
        <Button
          onClick={() => setMenuState("main")}
          className="bg-orange-600 hover:bg-orange-700"
        >
          Volver
        </Button>
      </div>

      <div className="max-w-2xl mx-auto">
        <div className="bg-gray-800 rounded-lg p-6 mb-8">
          <h3 className="text-xl font-semibold mb-4">Nombre de Usuario</h3>
          <div className="flex gap-4">
            <Input
              value={tempName}
              onChange={(e) => setTempName(e.target.value)}
              placeholder="Tu nombre"
              className="flex-1"
            />
            <Button onClick={handleSave} className="bg-green-600 hover:bg-green-700">
              Guardar
            </Button>
          </div>
        </div>

        <div className="bg-gray-800 rounded-lg p-6">
          <h3 className="text-xl font-semibold mb-4">Avatar</h3>
          <div className="grid grid-cols-5 gap-4">
            {AVATARS.map((avatar, index) => (
              <motion.div
                key={index}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className={`cursor-pointer rounded-lg p-2 ${
                  playerAvatar === avatar ? "bg-blue-600" : "bg-gray-700"
                }`}
                onClick={() => setPlayerAvatar(avatar)}
              >
                <img
                  src={avatar}
                  alt={`Avatar ${index + 1}`}
                  className="w-full h-auto rounded"
                />
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
