
import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Button } from "@/components/ui/button";
import { useGame } from "@/contexts/GameContext";
import { useToast } from "@/components/ui/use-toast";
import { Check, X, Sparkles, Zap, Waves as Wave, Rainbow } from 'lucide-react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

const GridPreview = ({ color }) => (
  <div className="grid grid-cols-4 gap-1 p-2 bg-white rounded-lg">
    {Array.from({ length: 16 }).map((_, i) => (
      <div key={i} className={`w-4 h-4 ${color}`} />
    ))}
  </div>
);

const EffectPreview = ({ effect }) => {
  const icons = {
    sparkle: <Sparkles className="w-6 h-6" />,
    explosion: <Zap className="w-6 h-6" />,
    wave: <Wave className="w-6 h-6" />,
    rainbow: <Rainbow className="w-6 h-6" />
  };

  return (
    <div className="flex items-center justify-center h-24 bg-gray-700 rounded-lg">
      {icons[effect]}
    </div>
  );
};

const PurchaseDialog = ({ isOpen, onClose, onConfirm, price, item }) => (
  <AnimatePresence>
    {isOpen && (
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 bg-black/50 flex items-center justify-center z-50"
      >
        <motion.div
          initial={{ scale: 0.9, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          exit={{ scale: 0.9, opacity: 0 }}
          className="bg-gray-800 p-6 rounded-lg shadow-xl max-w-md w-full"
        >
          <h3 className="text-xl font-bold mb-4">¿Deseas comprar {item}?</h3>
          <p className="mb-6">Precio: {price} 🪙</p>
          <div className="flex justify-end gap-4">
            <Button
              onClick={onClose}
              className="bg-gray-600 hover:bg-gray-700"
            >
              No
            </Button>
            <Button
              onClick={onConfirm}
              className="bg-green-600 hover:bg-green-700"
            >
              Sí
            </Button>
          </div>
        </motion.div>
      </motion.div>
    )}
  </AnimatePresence>
);

const GridCard = ({ name, color, price, unlocked, onPurchase, onSelect, isSelected }) => {
  const [showDialog, setShowDialog] = useState(false);

  return (
    <motion.div
      whileHover={{ scale: 1.02 }}
      className="relative bg-gray-800 rounded-lg overflow-hidden"
    >
      <div className="bg-gradient-to-r from-cyan-500 to-blue-500 text-white font-bold py-2 px-3 text-center">
        {name}
      </div>
      
      <div className="p-4">
        <GridPreview color={color} />
      </div>

      <div className="absolute bottom-4 right-4 flex items-center gap-2">
        {unlocked ? (
          <Button
            onClick={onSelect}
            className={`rounded-full w-8 h-8 p-0 ${isSelected ? "bg-green-500" : "bg-gray-600"}`}
          >
            <Check className="w-4 h-4" />
          </Button>
        ) : (
          <Button
            onClick={() => setShowDialog(true)}
            className="bg-yellow-400 text-black hover:bg-yellow-500 rounded-full flex items-center gap-1 px-3"
          >
            {price} 🪙
          </Button>
        )}
      </div>

      <PurchaseDialog
        isOpen={showDialog}
        onClose={() => setShowDialog(false)}
        onConfirm={() => {
          setShowDialog(false);
          onPurchase();
        }}
        price={price}
        item={name}
      />
    </motion.div>
  );
};

const EffectCard = ({ name, description, price, unlocked, onPurchase, onSelect, isSelected, effect }) => {
  const [showDialog, setShowDialog] = useState(false);

  return (
    <motion.div
      whileHover={{ scale: 1.02 }}
      className="relative bg-gray-800 rounded-lg overflow-hidden"
    >
      <div className="bg-gradient-to-r from-purple-500 to-pink-500 text-white font-bold py-2 px-3 text-center">
        {name}
      </div>
      
      <div className="p-4">
        <EffectPreview effect={effect} />
        <p className="text-sm text-gray-300 mt-2">{description}</p>
      </div>

      <div className="absolute bottom-4 right-4 flex items-center gap-2">
        {unlocked ? (
          <Button
            onClick={onSelect}
            className={`rounded-full w-8 h-8 p-0 ${isSelected ? "bg-green-500" : "bg-gray-600"}`}
          >
            <Check className="w-4 h-4" />
          </Button>
        ) : (
          <Button
            onClick={() => setShowDialog(true)}
            className="bg-yellow-400 text-black hover:bg-yellow-500 rounded-full flex items-center gap-1 px-3"
          >
            {price} 🪙
          </Button>
        )}
      </div>

      <PurchaseDialog
        isOpen={showDialog}
        onClose={() => setShowDialog(false)}
        onConfirm={() => {
          setShowDialog(false);
          onPurchase();
        }}
        price={price}
        item={name}
      />
    </motion.div>
  );
};

export default function Store() {
  const { grids, setGrids, effects, setEffects, coins, setCoins, selectedGrid, setSelectedGrid, setMenuState } = useGame();
  const { toast } = useToast();
  const [activeTab, setActiveTab] = useState("grids");

  const handlePurchase = (type, key) => {
    const items = type === "grid" ? grids : effects;
    const setItems = type === "grid" ? setGrids : setEffects;
    const item = items[key];

    if (coins >= item.price) {
      setCoins(prev => prev - item.price);
      setItems(prev => ({
        ...prev,
        [key]: { ...item, unlocked: true }
      }));
      toast({
        title: "¡Compra exitosa!",
        description: `Has desbloqueado ${item.name}`,
      });
    } else {
      toast({
        title: "Monedas insuficientes",
        description: "Necesitas más monedas para esta compra",
        variant: "destructive"
      });
    }
  };

  const handleSelect = (gridKey) => {
    setSelectedGrid(gridKey);
    toast({
      title: "Cuadrícula seleccionada",
      description: `${grids[gridKey].name} está ahora activa`,
    });
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex justify-between items-center mb-8">
        <div className="flex items-center gap-4">
          <Button
            onClick={() => setMenuState("main")}
            className="bg-gray-700 hover:bg-gray-600"
          >
            <X className="w-4 h-4 mr-2" />
            Volver
          </Button>
          <h2 className="text-3xl font-bold">Tienda</h2>
        </div>
        <div className="text-xl font-bold bg-yellow-400 text-black px-4 py-2 rounded-full">
          {coins} 🪙
        </div>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="grid w-full grid-cols-2 mb-8">
          <TabsTrigger value="grids">Cuadrículas</TabsTrigger>
          <TabsTrigger value="effects">Efectos Especiales</TabsTrigger>
        </TabsList>

        <TabsContent value="grids">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {Object.entries(grids).map(([key, grid]) => (
              <GridCard
                key={key}
                {...grid}
                onPurchase={() => handlePurchase("grid", key)}
                onSelect={() => handleSelect(key)}
                isSelected={selectedGrid === key}
              />
            ))}
          </div>
        </TabsContent>

        <TabsContent value="effects">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {Object.entries(effects).map(([key, effect]) => (
              <EffectCard
                key={key}
                {...effect}
                effect={key}
                onPurchase={() => handlePurchase("effect", key)}
                onSelect={() => {}}
                isSelected={false}
              />
            ))}
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}
