"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Progress } from "@/components/ui/progress";
import Navbar from "@/components/shared/Navbar";

interface Character {
  id: number;
  name: string;
  strength: number;
  speed: number;
  durability: number;
  power: number;
  combat: number;
  image?: string;
}

interface CharacterCardProps {
  character: Character;
  onDelete: (id: number) => void;
  onEdit: (id: number) => void;
}

const CharacterCard = ({ character, onDelete, onEdit }: CharacterCardProps) => {
  return (
    <Card className="bg-gray-800 text-white">
      <CardHeader>
        <CardTitle className="flex items-center space-x-4">
          <Avatar>
            {character.image ? (
              <AvatarImage src={`/uploads/characters/${character.image}`} alt={character.name} />
            ) : (
              <AvatarFallback>
                {character.name.slice(0, 2).toUpperCase()}
              </AvatarFallback>
            )}
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
        <div className="flex justify-end space-x-2 mt-4">
          <Button variant="outline" onClick={() => onEdit(character.id)}>
            Modifier
          </Button>
          <Button variant="destructive" onClick={() => onDelete(character.id)}>
            Supprimer
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};

const Characters = () => {
  const router = useRouter();
  const [characters, setCharacters] = useState<Character[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchCharacters();
  }, []);

  const fetchCharacters = async () => {
    try {
      const token = localStorage.getItem('jwtToken');
      if (!token) {
        router.push('/connexion');
        return;
      }

      const response = await fetch("https://127.0.0.1:8000/api/characters", {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });

      if (response.status === 401) {
        router.push('/connexion');
        return;
      }

      if (!response.ok) {
        throw new Error("Erreur lors de la récupération des personnages");
      }

      const data = await response.json();
      setCharacters(data);
      setIsLoading(false);
    } catch (err) {
      setError("Erreur lors du chargement des personnages. Veuillez réessayer plus tard.");
      setIsLoading(false);
    }
  };

  const handleDelete = async (id: number) => {
    try {
      const token = localStorage.getItem('jwtToken');
      if (!token) {
        router.push('/connexion');
        return;
      }

      const response = await fetch(`https://127.0.0.1:8000/api/characters/${id}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });

      if (!response.ok) {
        throw new Error("Erreur lors de la suppression du personnage");
      }

      setCharacters(characters.filter(character => character.id !== id));
    } catch (err) {
      setError("Erreur lors de la suppression du personnage. Veuillez réessayer plus tard.");
    }
  };

  if (isLoading) {
    return <div className="text-center">Chargement...</div>;
  }

  if (error) {
    return <div className="text-center text-red-500">{error}</div>;
  }

  return (
    <div className="min-h-screen bg-gray-900 text-white">
      <Navbar />
      <main className="container mx-auto px-4 py-8">
        <motion.h1
          initial={{ y: -50, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.5 }}
          className="text-4xl font-bold mb-8 text-center"
        >
          Les Combattants
        </motion.h1>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {characters.map((character) => (
            <motion.div
              key={character.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
            >
              <CharacterCard
                character={character}
                onDelete={handleDelete}
                onEdit={(id: number) => router.push(`/modification/${id}`)}
              />
            </motion.div>
          ))}
        </div>
      </main>
    </div>
  );
};

export default Characters;
