"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Progress } from "@/components/ui/progress";
import Navbar from "@/components/shared/Navbar";

interface Character {
  id: number;
  name: string;
  image: string;
  strength: number;
  speed: number;
  durability: number;
  power: number;
  combat: number;
}

const CharacterCard = ({ character }: { character: Character }) => {
  return (
    <Card className="bg-gray-800 text-white">
      <CardHeader>
        <CardTitle className="flex items-center space-x-4">
          <Avatar>
            <AvatarImage src={character.image} alt={character.name} />
            <AvatarFallback>
              {character.name.slice(0, 2).toUpperCase()}
            </AvatarFallback>
          </Avatar>
          <span>{character.name}</span>
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-2">
          <div>
            <div className="flex justify-between text-sm">
              <span>Strength</span>
              <span>{character.strength}</span>
            </div>
            <Progress value={character.strength} className="h-2 bg-white" />
          </div>
          <div>
            <div className="flex justify-between text-sm">
              <span>Speed</span>
              <span>{character.speed}</span>
            </div>
            <Progress value={character.speed} className="h-2 bg-white" />
          </div>
          <div>
            <div className="flex justify-between text-sm">
              <span>Durability</span>
              <span>{character.durability}</span>
            </div>
            <Progress value={character.durability} className="h-2 bg-white" />
          </div>
          <div>
            <div className="flex justify-between text-sm">
              <span>Power</span>
              <span>{character.power}</span>
            </div>
            <Progress value={character.power} className="h-2 bg-white" />
          </div>
          <div>
            <div className="flex justify-between text-sm">
              <span>Combat</span>
              <span>{character.combat}</span>
            </div>
            <Progress value={character.combat} className="h-2 bg-white" />
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default function CharactersPage() {
  const [characters, setCharacters] = useState<Character[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchCharacters();
  }, []);

  const fetchCharacters = async () => {
    setIsLoading(true);
    setError(null);
    try {
      // In a real application, you would fetch data from your API here
      // For demonstration, we'll use mock data
      const mockCharacters: Character[] = [
        {
          id: 1,
          name: "Ryu",
          image: "/placeholder.svg",
          strength: 80,
          speed: 70,
          durability: 65,
          power: 75,
          combat: 90,
        },
        {
          id: 2,
          name: "Chun-Li",
          image: "/placeholder.svg",
          strength: 65,
          speed: 90,
          durability: 60,
          power: 70,
          combat: 85,
        },
        {
          id: 3,
          name: "Guile",
          image: "/placeholder.svg",
          strength: 75,
          speed: 65,
          durability: 80,
          power: 70,
          combat: 85,
        },
        {
          id: 4,
          name: "Zangief",
          image: "/placeholder.svg",
          strength: 95,
          speed: 40,
          durability: 90,
          power: 85,
          combat: 70,
        },
      ];
      setCharacters(mockCharacters);
      setIsLoading(false);
    } catch (err) {
      setError("Failed to load characters. Please try again later.");
      setIsLoading(false);
    }
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
          Les Combattants
        </motion.h1>

        {isLoading ? (
          <p className="text-center">Loading characters...</p>
        ) : error ? (
          <p className="text-center text-red-500">{error}</p>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {characters.map((character) => (
              <motion.div
                key={character.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
              >
                <CharacterCard character={character} />
              </motion.div>
            ))}
          </div>
        )}
      </main>
    </div>
  );
}
