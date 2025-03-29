
import React from "react";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { useGame } from "@/contexts/GameContext";

const resolutions = ["1920x1080", "1600x900", "1366x768", "1280x720"];
const gridSizes = [
  { name: "Mini", size: 12 },
  { name: "Pequeño", size: 14 },
  { name: "Normal", size: 16 },
  { name: "Grande", size: 18 },
  { name: "Gigantesco", size: 20 }
];

export default function Options() {
  const { 
    resolution, 
    setResolution, 
    setMenuState, 
    theme, 
    setTheme,
    gridSize,
    setGridSize
  } = useGame();

  return (
    <div className="flex flex-col items-center justify-center min-h-[80vh] gap-8">
      <motion.div
        initial={{ y: -20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        className="text-center mb-8"
      >
        <h2 className="text-3xl font-bold mb-8">Opciones</h2>
        
        <div className="space-y-8">
          <div className="bg-gray-800 p-6 rounded-lg shadow-lg">
            <h3 className="text-xl mb-4">Resolución</h3>
            <div className="grid grid-cols-2 gap-4">
              {resolutions.map((res) => (
                <Button
                  key={res}
                  onClick={() => setResolution(res)}
                  variant={resolution === res ? "default" : "outline"}
                  className={resolution === res ? "bg-blue-600" : ""}
                >
                  {res}
                </Button>
              ))}
            </div>
          </div>

          <div className="bg-gray-800 p-6 rounded-lg shadow-lg">
            <h3 className="text-xl mb-4">Tamaño de Cuadrícula</h3>
            <div className="grid grid-cols-2 gap-4">
              {gridSizes.map((size) => (
                <Button
                  key={size.name}
                  onClick={() => setGridSize(size.size)}
                  variant={gridSize === size.size ? "default" : "outline"}
                  className={gridSize === size.size ? "bg-blue-600" : ""}
                >
                  {size.name}
                </Button>
              ))}
            </div>
          </div>

          <div className="bg-gray-800 p-6 rounded-lg shadow-lg">
            <h3 className="text-xl mb-4">Tema</h3>
            <div className="grid grid-cols-2 gap-4">
              <Button
                onClick={() => setTheme("light")}
                variant={theme === "light" ? "default" : "outline"}
                className={theme === "light" ? "bg-blue-600" : ""}
              >
                Claro
              </Button>
              <Button
                onClick={() => setTheme("dark")}
                variant={theme === "dark" ? "default" : "outline"}
                className={theme === "dark" ? "bg-blue-600" : ""}
              >
                Oscuro
              </Button>
            </div>
          </div>
        </div>
      </motion.div>

      <Button
        onClick={() => setMenuState("main")}
        className="bg-orange-600 hover:bg-orange-700 mt-8"
      >
        Volver al Menú
      </Button>
    </div>
  );
}
