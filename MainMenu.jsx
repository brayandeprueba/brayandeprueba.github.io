
import React from "react";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { useGame } from "@/contexts/GameContext";
import { useToast } from "@/components/ui/use-toast";

const GameModeCard = ({ mode, color, onClick, description }) => (
  <motion.div
    whileHover={{ scale: 1.05 }}
    whileTap={{ scale: 0.95 }}
    className={`w-full p-6 rounded-lg ${color} transform transition-all duration-300 cursor-pointer`}
    onClick={onClick}
  >
    <div className="relative overflow-hidden rounded-lg bg-gradient-to-br from-black/50 to-transparent p-4">
      <div className="absolute top-0 left-0 w-full h-2 bg-gradient-to-r from-white/20 to-transparent" />
      <h3 className="text-2xl font-bold mb-2 text-white">{mode}</h3>
      <p className="text-sm text-white/80">{description}</p>
    </div>
  </motion.div>
);

export default function MainMenu() {
  const { menuState, setMenuState, setGameMode, coins } = useGame();
  const { toast } = useToast();

  const handleModeSelect = (mode) => {
    if (mode === "extreme") {
      toast({
        title: "¡Modo Extremo!",
        description: "¿Estás preparado para el desafío definitivo?",
      });
    }
    setGameMode(mode);
  };

  if (menuState === "main") {
    return (
      <div className="flex flex-col items-center justify-center min-h-[80vh] gap-8">
        <motion.div
          initial={{ y: -50, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          className="text-center mb-8"
        >
          <img alt="Game Logo" className="w-64 mx-auto mb-4" src="https://storage.googleapis.com/hostinger-horizons-assets-prod/23459810-63d9-4d74-b890-5133eff3f2b6/1b709e4a4cedaa9d06889510a732048b.png" />
          <h1 className="text-4xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-red-500 to-blue-500">
            Stunt Show Beta
          </h1>
        </motion.div>

        <div className="flex flex-col gap-4 w-full max-w-xs">
          <Button
            onClick={() => setMenuState("modes")}
            className="bg-blue-600 hover:bg-blue-700 text-lg py-6 transform hover:scale-105 transition-all"
          >
            Jugar
          </Button>
          
          <Button
            onClick={() => setMenuState("store")}
            className="bg-purple-600 hover:bg-purple-700 text-lg py-6 transform hover:scale-105 transition-all"
          >
            Tienda
            <span className="ml-2 text-sm bg-yellow-400 text-black px-2 py-1 rounded-full">
              {coins}
            </span>
          </Button>
          
          <Button
            onClick={() => setMenuState("ranking")}
            className="bg-green-600 hover:bg-green-700 text-lg py-6 transform hover:scale-105 transition-all"
          >
            Ranking
          </Button>

          <Button
            onClick={() => setMenuState("profile")}
            className="bg-pink-600 hover:bg-pink-700 text-lg py-6 transform hover:scale-105 transition-all"
          >
            Perfil
          </Button>
          
          <Button
            onClick={() => setMenuState("options")}
            className="bg-orange-600 hover:bg-orange-700 text-lg py-6 transform hover:scale-105 transition-all"
          >
            Opciones
          </Button>
        </div>
      </div>
    );
  }

  if (menuState === "modes") {
    return (
      <div className="flex flex-col items-center justify-center min-h-[80vh] gap-8">
        <motion.div
          initial={{ y: -20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          className="text-center mb-8"
        >
          <h2 className="text-3xl font-bold mb-4">Selecciona un Modo</h2>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 w-full max-w-4xl">
          <GameModeCard
            mode="Normal"
            color="bg-gradient-to-br from-blue-600 to-blue-800"
            onClick={() => handleModeSelect("normal")}
            description="¡Encuentra los números en orden! El modo clásico para poner a prueba tu velocidad."
          />
          
          <GameModeCard
            mode="Competitivo"
            color="bg-gradient-to-br from-green-600 to-green-800"
            onClick={() => handleModeSelect("competitive")}
            description="Compite contra PEPE AI. ¿Podrás superar a la máquina?"
          />
          
          <GameModeCard
            mode="Sumamos"
            color="bg-gradient-to-br from-purple-600 to-purple-800"
            onClick={() => handleModeSelect("sumamos")}
            description="Los números no paran de aparecer. ¡Mantén el ritmo!"
          />
          
          <GameModeCard
            mode="Contrarreloj"
            color="bg-gradient-to-br from-red-600 to-red-800"
            onClick={() => handleModeSelect("contrarreloj")}
            description="La carrera contra el tiempo. Cada segundo cuenta."
          />
          
          <GameModeCard
            mode="Espejo"
            color="bg-gradient-to-br from-cyan-600 to-cyan-800"
            onClick={() => handleModeSelect("mirror")}
            description="Todo está invertido. Pon a prueba tu percepción."
          />
          
          <GameModeCard
            mode="Extremo"
            color="bg-gradient-to-br from-yellow-600 to-red-800"
            onClick={() => handleModeSelect("extreme")}
            description="Solo para expertos. Los números desaparecen si no eres rápido."
          />
        </div>

        <Button
          onClick={() => setMenuState("main")}
          className="bg-orange-600 hover:bg-orange-700 text-lg py-6 transform hover:scale-105 transition-all mt-8"
        >
          Volver
        </Button>
      </div>
    );
  }

  return null;
}
