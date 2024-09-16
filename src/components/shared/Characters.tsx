"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { ChevronLeft, ChevronRight } from "lucide-react";

interface Character {
  id: number;
  name: string;
  image: string;
}

const Characters = () => {
  const [characters, setCharacters] = useState<Character[]>([]);
  const [currentCharacter, setCurrentCharacter] = useState(0);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchCharacters();
  }, []);

  const fetchCharacters = async () => {
    try {
      const response = await fetch("https://api.example.com/characters"); // Replace with your Symfony API endpoint
      if (!response.ok) {
        throw new Error("Failed to fetch characters");
      }
      const data = await response.json();
      setCharacters(data);
      setIsLoading(false);
    } catch (err) {
      setError("Failed to load characters. Please try again later.");
      setIsLoading(false);
    }
  };

  const nextCharacter = () => {
    setCurrentCharacter((prev) => (prev + 1) % characters.length);
  };

  const prevCharacter = () => {
    setCurrentCharacter(
      (prev) => (prev - 1 + characters.length) % characters.length
    );
  };

  return (
    <section className="py-16 bg-gray-800">
      <div className="container mx-auto px-4">
        <h2 className="text-4xl font-bold mb-8 text-center">
          Rencontre les combattants
        </h2>
        {isLoading ? (
          <p className="text-center">Chargement des combattants...</p>
        ) : error ? (
          <p className="text-center text-red-500">{error}</p>
        ) : characters.length > 0 ? (
          <div className="flex items-center justify-center">
            <button onClick={prevCharacter} className="mr-4">
              <ChevronLeft size={24} />
            </button>
            <motion.div
              key={currentCharacter}
              initial={{ opacity: 0, x: 50 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -50 }}
              transition={{ duration: 0.3 }}
              className="text-center"
            >
              <img
                src={characters[currentCharacter].image}
                alt={characters[currentCharacter].name}
                className="mx-auto mb-4 rounded-lg shadow-lg w-64 h-64 object-cover"
              />
              <h3 className="text-2xl font-bold">
                {characters[currentCharacter].name}
              </h3>
            </motion.div>
            <button onClick={nextCharacter} className="ml-4">
              <ChevronRight size={24} />
            </button>
          </div>
        ) : (
          <p className="text-center">Pas de combattants disponible.</p>
        )}
      </div>
    </section>
  );
};

export default Characters;
