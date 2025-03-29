
import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { useGame } from "@/contexts/GameContext";
import { useToast } from "@/components/ui/use-toast";

const DIFFICULTY_TIMES = {
  principiante: 20,
  amateur: 18,
  profesional: 15,
  leyenda: 12,
  top: 8
};

const AI_SPEEDS = {
  principiante: 800,
  amateur: 700,
  profesional: 600,
  leyenda: 480,
  top: 320
};

export default function GameBoard() {
  const { gameMode, setGameMode, aiDifficulty, setAiDifficulty, setCoins, personalBests, setPersonalBests, grids, selectedGrid } = useGame();
  const { toast } = useToast();
  const [numbers, setNumbers] = useState([]);
  const [aiNumbers, setAiNumbers] = useState([]);
  const [currentNumber, setCurrentNumber] = useState(1);
  const [aiCurrentNumber, setAiCurrentNumber] = useState(1);
  const [time, setTime] = useState(0);
  const [timeLimit, setTimeLimit] = useState(DIFFICULTY_TIMES[aiDifficulty]);
  const [isPlaying, setIsPlaying] = useState(false);
  const [nextNumber, setNextNumber] = useState(26);
  const [combo, setCombo] = useState(0);
  const [showNumbers, setShowNumbers] = useState(false);
  const [hiddenNumbers, setHiddenNumbers] = useState(new Set());
  const [isPenalized, setIsPenalized] = useState(false);

  useEffect(() => {
    if (isPlaying) {
      const timer = setInterval(() => {
        setTime((prev) => {
          if (gameMode === "contrarreloj" && prev >= timeLimit) {
            clearInterval(timer);
            setIsPlaying(false);
            toast({
              title: "¡Tiempo agotado!",
              description: "No lograste completar el desafío a tiempo",
              variant: "destructive"
            });
            return prev;
          }
          return prev + 0.1;
        });
      }, 100);
      return () => clearInterval(timer);
    }
  }, [isPlaying, gameMode, timeLimit]);

  useEffect(() => {
    if (gameMode === "competitive" && isPlaying) {
      const aiTimer = setInterval(() => {
        setAiCurrentNumber((prev) => {
          if (prev >= 25) {
            clearInterval(aiTimer);
            toast({
              title: "¡Fin del juego!",
              description: "¡PEPE AI ha ganado!",
              variant: "destructive"
            });
            setIsPlaying(false);
            return prev;
          }
          return prev + 1;
        });
      }, AI_SPEEDS[aiDifficulty]);

      return () => clearInterval(aiTimer);
    }
  }, [gameMode, isPlaying, aiDifficulty]);

  useEffect(() => {
    if (gameMode === "sumamos" && isPlaying) {
      const sumamosTimer = setInterval(() => {
        setNumbers((prev) => {
          const emptySpaces = prev.filter(n => n < currentNumber).length;
          if (emptySpaces >= 2) {
            const newNumbers = [...prev];
            let added = 0;
            
            for (let i = 0; i < newNumbers.length && added < 2; i++) {
              if (newNumbers[i] < currentNumber) {
                newNumbers[i] = nextNumber + added;
                added++;
              }
            }
            
            setNextNumber(prev => prev + added);
            return newNumbers;
          }
          return prev;
        });
      }, 2000);

      return () => clearInterval(sumamosTimer);
    }
  }, [gameMode, isPlaying, currentNumber, nextNumber]);

  useEffect(() => {
    if (gameMode === "extreme" && isPlaying) {
      const extremeTimer = setInterval(() => {
        const availableNumbers = numbers
          .map((n, i) => ({ number: n, index: i }))
          .filter(({ number }) => number >= currentNumber);

        if (availableNumbers.length > 0) {
          const randomIndex = Math.floor(Math.random() * availableNumbers.length);
          setHiddenNumbers(prev => new Set([...prev, availableNumbers[randomIndex].index]));
        }
      }, 3000);

      return () => clearInterval(extremeTimer);
    }
  }, [gameMode, isPlaying, numbers, currentNumber]);

  const generateNumbers = () => {
    const nums = Array.from({ length: 25 }, (_, i) => i + 1);
    for (let i = nums.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [nums[i], nums[j]] = [nums[j], nums[i]];
    }
    return nums;
  };

  const startGame = () => {
    const nums = generateNumbers();
    setNumbers(nums);
    setAiNumbers(generateNumbers());
    setCurrentNumber(1);
    setAiCurrentNumber(1);
    setTime(0);
    setNextNumber(26);
    setCombo(0);
    setHiddenNumbers(new Set());
    setShowNumbers(gameMode !== "normal");
    setIsPlaying(true);
    if (gameMode === "contrarreloj") {
      setTimeLimit(DIFFICULTY_TIMES[aiDifficulty]);
    }
    if (gameMode === "normal") {
      setTimeout(() => setShowNumbers(true), 500);
    }
  };

  const handleNumberClick = (number, index) => {
    if (!isPlaying || !showNumbers || isPenalized) return;

    if (number === currentNumber) {
      setCombo(prev => prev + 1);
      if (currentNumber === 25 && gameMode !== "sumamos") {
        setIsPlaying(false);
        const finalTime = time;
        
        if (finalTime < personalBests[gameMode]) {
          setPersonalBests(prev => ({
            ...prev,
            [gameMode]: finalTime
          }));
        }
        
        const coinsEarned = Math.floor((25 - finalTime) * 2);
        if (coinsEarned > 0) {
          setCoins(prev => prev + coinsEarned);
        }
        
        toast({
          title: "¡Felicitaciones!",
          description: `Completaste el juego en ${finalTime.toFixed(1)} segundos\n¡Ganaste ${coinsEarned} monedas!`,
        });
      } else {
        setCurrentNumber((prev) => prev + 1);
        if (gameMode === "extreme") {
          setHiddenNumbers(prev => {
            const next = new Set(prev);
            next.delete(index);
            return next;
          });
        }
      }
    } else if (number >= currentNumber) {
      setCombo(0);
      if (["competitive", "extreme", "sumamos"].includes(gameMode)) {
        setIsPenalized(true);
        setTimeout(() => setIsPenalized(false), 3000);
      } else {
        setTime((prev) => prev + 3);
      }
      toast({
        title: "¡Error!",
        description: gameMode === "normal" ? "+3 segundos de penalización" : "Bloqueado por 3 segundos",
        variant: "destructive",
      });
    }
  };

  const renderNumber = (number, index) => {
    if (number < currentNumber) return "";
    if (!showNumbers) return "";
    if (gameMode === "mirror") return <span style={{ transform: "scaleX(-1)" }}>{number}</span>;
    if (gameMode === "extreme" && hiddenNumbers.has(index)) return "?";
    return number;
  };

  const selectedStyle = grids[selectedGrid]?.color || "bg-blue-600";

  return (
    <div className="flex flex-col items-center justify-center min-h-[80vh] gap-8">
      <div className="flex justify-between w-full max-w-4xl mb-8">
        <Button
          onClick={() => setGameMode("menu")}
          className="bg-orange-600 hover:bg-orange-700 transform hover:scale-105 transition-all"
        >
          Volver al Menú
        </Button>
        <div className="text-2xl font-bold">
          {gameMode === "contrarreloj" 
            ? `Tiempo restante: ${(timeLimit - time).toFixed(1)}s`
            : `Tiempo: ${time.toFixed(1)}s`
          }
        </div>
        <Button
          onClick={startGame}
          className="bg-green-600 hover:bg-green-700 transform hover:scale-105 transition-all"
        >
          {isPlaying ? "Reiniciar" : "Comenzar"}
        </Button>
      </div>

      {(gameMode === "competitive" || gameMode === "contrarreloj") && (
        <div className="flex justify-center gap-4 mb-4">
          <Button
            onClick={() => setAiDifficulty("principiante")}
            className={`${aiDifficulty === "principiante" ? "bg-blue-600" : "bg-gray-600"} transform hover:scale-105 transition-all`}
          >
            Principiante
          </Button>
          <Button
            onClick={() => setAiDifficulty("amateur")}
            className={`${aiDifficulty === "amateur" ? "bg-blue-600" : "bg-gray-600"} transform hover:scale-105 transition-all`}
          >
            Amateur
          </Button>
          <Button
            onClick={() => setAiDifficulty("profesional")}
            className={`${aiDifficulty === "profesional" ? "bg-blue-600" : "bg-gray-600"} transform hover:scale-105 transition-all`}
          >
            Profesional
          </Button>
          <Button
            onClick={() => setAiDifficulty("leyenda")}
            className={`${aiDifficulty === "leyenda" ? "bg-blue-600" : "bg-gray-600"} transform hover:scale-105 transition-all`}
          >
            Leyenda
          </Button>
          <Button
            onClick={() => setAiDifficulty("top")}
            className={`${aiDifficulty === "top" ? "bg-blue-600" : "bg-gray-600"} transform hover:scale-105 transition-all`}
          >
            TOP
          </Button>
        </div>
      )}

      <div className="flex flex-col md:flex-row gap-8">
        <motion.div
          initial={{ scale: 0.9, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          className="grid grid-cols-5 gap-2"
        >
          {numbers.map((number, index) => (
            <motion.button
              key={index}
              onClick={() => handleNumberClick(number, index)}
              className={`w-16 h-16 rounded-lg flex items-center justify-center text-xl font-bold relative
                ${number < currentNumber
                  ? "bg-gray-900 cursor-not-allowed"
                  : showNumbers 
                    ? `${selectedStyle} hover:opacity-90 cursor-pointer`
                    : "bg-gray-900 cursor-not-allowed"}`}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              {renderNumber(number, index)}
              {isPenalized && (
                <div className="absolute inset-0 bg-black/50 flex items-center justify-center rounded-lg">
                  🔒
                </div>
              )}
            </motion.button>
          ))}
        </motion.div>

        {gameMode === "competitive" && (
          <div className="flex flex-col items-center gap-4">
            <h3 className="text-xl font-bold text-red-500">PEPE AI</h3>
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              className="grid grid-cols-5 gap-2"
            >
              {aiNumbers.map((number, index) => (
                <div
                  key={index}
                  className={`w-16 h-16 rounded-lg flex items-center justify-center text-xl font-bold
                    ${number < aiCurrentNumber
                      ? "bg-gray-900"
                      : "bg-red-600"}`}
                >
                  {number < aiCurrentNumber ? "" : number}
                </div>
              ))}
            </motion.div>
          </div>
        )}
      </div>

      {combo > 0 && (
        <motion.div
          initial={{ scale: 0, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          className="absolute top-4 right-4 bg-yellow-400 text-black px-4 py-2 rounded-full font-bold"
        >
          Combo x{combo}
        </motion.div>
      )}
    </div>
  );
}
