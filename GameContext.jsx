
import React, { createContext, useContext, useState, useEffect } from "react";

const GameContext = createContext();

const INITIAL_GRIDS = {
  default: {
    name: "Cuadrícula Clásica",
    unlocked: true,
    price: 0,
    color: "bg-blue-600"
  },
  white: {
    name: "Blanco Elegante",
    unlocked: false,
    price: 100,
    color: "bg-white text-black"
  },
  red: {
    name: "Rojo Fuego",
    unlocked: false,
    price: 100,
    color: "bg-red-500"
  },
  purple: {
    name: "Púrpura Real",
    unlocked: false,
    price: 100,
    color: "bg-purple-500"
  },
  pink: {
    name: "Rosa Neón",
    unlocked: false,
    price: 100,
    color: "bg-pink-500"
  },
  indigo: {
    name: "Índigo Profundo",
    unlocked: false,
    price: 100,
    color: "bg-indigo-500"
  },
  teal: {
    name: "Turquesa Brillante",
    unlocked: false,
    price: 100,
    color: "bg-teal-500"
  },
  cyan: {
    name: "Cian Eléctrico",
    unlocked: false,
    price: 100,
    color: "bg-cyan-400"
  },
  blue: {
    name: "Azul Océano",
    unlocked: false,
    price: 100,
    color: "bg-blue-400"
  },
  green: {
    name: "Verde Esmeralda",
    unlocked: false,
    price: 100,
    color: "bg-green-500"
  },
  lime: {
    name: "Lima Fresco",
    unlocked: false,
    price: 100,
    color: "bg-lime-400"
  },
  yellow: {
    name: "Amarillo Solar",
    unlocked: false,
    price: 100,
    color: "bg-yellow-400"
  },
  orange: {
    name: "Naranja Atardecer",
    unlocked: false,
    price: 100,
    color: "bg-orange-500"
  },
  // New epic grid styles
  rainbow: {
    name: "Arcoíris Dinámico",
    unlocked: false,
    price: 500,
    color: "bg-gradient-to-r from-red-500 via-yellow-500 to-blue-500"
  },
  galaxy: {
    name: "Galaxia Mística",
    unlocked: false,
    price: 1000,
    color: "bg-gradient-to-r from-purple-900 via-indigo-500 to-purple-300"
  },
  fire: {
    name: "Llamas Infernales",
    unlocked: false,
    price: 750,
    color: "bg-gradient-to-t from-red-700 via-orange-500 to-yellow-300"
  },
  ice: {
    name: "Hielo Eterno",
    unlocked: false,
    price: 750,
    color: "bg-gradient-to-b from-blue-300 via-cyan-400 to-white"
  }
};

const INITIAL_EFFECTS = {
  sparkle: {
    name: "Destellos Mágicos",
    unlocked: false,
    price: 200,
    description: "Añade brillos y destellos a los números correctos"
  },
  explosion: {
    name: "Explosión de Partículas",
    unlocked: false,
    price: 300,
    description: "Los números explotan en partículas al ser seleccionados"
  },
  wave: {
    name: "Onda Expansiva",
    unlocked: false,
    price: 400,
    description: "Crea una onda que se expande al seleccionar números"
  },
  rainbow: {
    name: "Rastro Arcoíris",
    unlocked: false,
    price: 500,
    description: "Deja un rastro de colores al mover el cursor"
  }
};

const DIFFICULTY_TIMES = {
  principiante: 20,
  amateur: 18,
  profesional: 15,
  leyenda: 12,
  top: 8
};

export function useGame() {
  return useContext(GameContext);
}

function GameProvider({ children }) {
  const [resolution, setResolution] = useState("1920x1080");
  const [gameMode, setGameMode] = useState("menu");
  const [aiDifficulty, setAiDifficulty] = useState("amateur");
  const [coins, setCoins] = useState(() => {
    const saved = localStorage.getItem("coins");
    return saved ? parseInt(saved) : 0;
  });
  const [theme, setTheme] = useState("dark");
  const [selectedGrid, setSelectedGrid] = useState("default");
  const [menuState, setMenuState] = useState("main");
  const [grids, setGrids] = useState(() => {
    const saved = localStorage.getItem("grids");
    return saved ? JSON.parse(saved) : INITIAL_GRIDS;
  });
  const [effects, setEffects] = useState(() => {
    const saved = localStorage.getItem("effects");
    return saved ? JSON.parse(saved) : INITIAL_EFFECTS;
  });
  const [gridSize, setGridSize] = useState(16);
  const [personalBests, setPersonalBests] = useState(() => {
    const saved = localStorage.getItem("personalBests");
    return saved ? JSON.parse(saved) : {
      normal: Infinity,
      competitive: Infinity,
      sumamos: Infinity,
      contrarreloj: Infinity,
      mirror: Infinity,
      extreme: Infinity
    };
  });
  const [globalRanking, setGlobalRanking] = useState([
    { name: "Player1", coins: 1000, bestTime: 10.5 },
    { name: "Player2", coins: 800, bestTime: 11.2 },
    { name: "Player3", coins: 600, bestTime: 12.0 }
  ]);

  useEffect(() => {
    localStorage.setItem("coins", coins);
    localStorage.setItem("grids", JSON.stringify(grids));
    localStorage.setItem("effects", JSON.stringify(effects));
    localStorage.setItem("personalBests", JSON.stringify(personalBests));
  }, [coins, grids, effects, personalBests]);

  useEffect(() => {
    const [width] = resolution.split("x").map(Number);
    setGridSize(Math.floor(width / 30));
  }, [resolution]);

  const value = {
    resolution,
    setResolution,
    gameMode,
    setGameMode,
    aiDifficulty,
    setAiDifficulty,
    coins,
    setCoins,
    theme,
    setTheme,
    selectedGrid,
    setSelectedGrid,
    menuState,
    setMenuState,
    grids,
    setGrids,
    effects,
    setEffects,
    gridSize,
    setGridSize,
    personalBests,
    setPersonalBests,
    globalRanking,
    setGlobalRanking,
    DIFFICULTY_TIMES
  };

  return (
    <GameContext.Provider value={value}>
      {children}
    </GameContext.Provider>
  );
}

export default GameProvider;
