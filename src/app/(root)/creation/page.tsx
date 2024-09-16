"use client";

import { motion } from "framer-motion";
import Navbar from "@/components/shared/Navbar";
import CharacterForm from "@/components/shared/CharacterForm";

export default function CreateCharacter() {
  const handleCharacterSubmit = (character: {
    nom: string;
    image: string | ArrayBuffer | null;
    force: number;
    vitesse: number;
    endurance: number;
    power: number;
    combat: number;
  }) => {
    // Logique d'envoi au backend
    console.log("Character created:", character);
    // Redirection possible après la création
  };

  return (
    <div className="min-h-screen bg-gray-900 text-white">
      {/* Navbar */}
      <Navbar />

      {/* Main Content */}
      <main className="container mx-auto px-4 py-8">
        <motion.h1
          initial={{ y: -50, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.5 }}
          className="text-4xl font-bold mb-8 text-center"
        >
          Créer votre combattant
        </motion.h1>

        {/* Formulaire de création de personnage */}
        <CharacterForm onSubmit={handleCharacterSubmit} />
      </main>
    </div>
  );
}
