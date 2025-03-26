"use client";

import { motion } from "framer-motion";
import Navbar from "@/components/shared/Navbar";
import CharacterForm from "@/components/shared/CharacterForm";

export default function CreateCharacter() {
  const handleCharacterSubmit = async (character: {
    nom: string;
    image: string | ArrayBuffer | null;
    force: number;
    vitesse: number;
    endurance: number;
    power: number;
    combat: number;
  }) => {

    // Données à envoyer
    const characterData = {
      name: "Ok", // Nom du personnage
      strength: 85, // Force
      speed: 100, // Vitesse
      durability: 52, // Endurance
      power: 10, // Puissance
      combat: 50 // Combat
  };

  try {
      const response = await fetch("http://127.0.0.1:8000/api/characters/add", {
          method: "POST",
          headers: {
              "Authorization": `Bearer ${localStorage.getItem("jwtToken")}`, // Ajoutez le token JWT ici
          },
          body: JSON.stringify(characterData), // Convertir les données en JSON
          // body: JSON.stringify('hello'), // Convertir les données en JSON

      });

      if (!response.ok) {
          const errorData = await response.json();
          throw new Error(`Failed to create character: ${errorData.error || response.statusText}`);
      }

      const data = await response.json();
      console.log("Character created:", data);
      // Redirection ou mise à jour de l'état après la création
  } catch (error) {
      console.error("Error during character creation:", error);
  }
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
