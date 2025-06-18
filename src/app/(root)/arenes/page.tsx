"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Navbar from "@/components/shared/Navbar";
import LevelCard from "@/components/arenes/LevelCard";
import CharacterSelectionModal from "@/components/arenes/CharacterSelectionModal";

interface UserCharacter {
  id: number;
  name: string;
  strength: number;
  speed: number;
  durability: number;
  power: number;
  combat: number;
  user: number;
  image: string | null;
}

// Données de test pour les niveaux
const MOCK_LEVELS = [
  {
    id: 1,
    name: "La Forêt Mystérieuse",
    difficulty: "Facile",
    environment: "Forêt",
    isUnlocked: true,
    isCompleted: true,
    stars: 3,
  },
  {
    id: 2,
    name: "Les Grottes Sombres",
    difficulty: "Facile",
    environment: "Grotte",
    isUnlocked: true,
    isCompleted: false,
    stars: 0,
  },
  {
    id: 3,
    name: "Le Désert Ardent",
    difficulty: "Moyen",
    environment: "Désert",
    isUnlocked: false,
    isCompleted: false,
    stars: 0,
  },
  {
    id: 4,
    name: "Les Pics Glacés",
    difficulty: "Moyen",
    environment: "Montagne",
    isUnlocked: false,
    isCompleted: false,
    stars: 0,
  },
  {
    id: 5,
    name: "Le Volcan",
    difficulty: "Difficile",
    environment: "Volcan",
    isUnlocked: false,
    isCompleted: false,
    stars: 0,
  },
] as const;

export default function ArenesPage() {
  const router = useRouter();
  const [selectedLevel, setSelectedLevel] = useState<number | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [userCharacters, setUserCharacters] = useState<UserCharacter[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const loadCharacters = async () => {
      setIsLoading(true);
      setError(null);
      try {
        const token = localStorage.getItem("jwtToken");
        if (!token) {
          window.location.href = "/connexion";
          return;
        }

        const response = await fetch("https://127.0.0.1:8000/api/characters", {
          headers: {
            "Authorization": `Bearer ${token}`
          }
        });

        if (!response.ok) {
          if (response.status === 401) {
            localStorage.removeItem("jwtToken");
            window.location.href = "/connexion";
            return;
          }
          throw new Error("Failed to fetch characters");
        }

        const data = await response.json();
        setUserCharacters(data);
        
        if (data.length === 0) {
          window.location.href = "/creation";
          return;
        }
      } catch (err) {
        setError("Échec du chargement des personnages. Veuillez réessayer.");
        console.error('Failed to load characters:', err);
      } finally {
        setIsLoading(false);
      }
    };

    loadCharacters();
  }, []);

  const handleLevelClick = (levelId: number) => {
    setSelectedLevel(levelId);
    if (userCharacters.length === 0) {
      router.push("/creation");
    } else {
      setIsModalOpen(true);
    }
  };

  const handleCharacterSelect = (characterId: number) => {
    setIsModalOpen(false);
    if (selectedLevel) {
      // Rediriger vers la page de l'arène avec le niveau et le personnage sélectionnés
      window.location.href = `/arenes/${selectedLevel}?character=${characterId}`;
    }
  };

  return (
    <div className="min-h-screen bg-[rgb(31,41,55)]">
      <Navbar />
      <main className="px-4 py-8 w-[99vw]">
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-center mb-4">Arènes</h1>
          <p className="text-center text-gray-600 mb-8">
            Progressez à travers différents niveaux et relevez des défis de plus en plus difficiles
          </p>
        </div>

        <div className="flex flex-wrap justify-center items-center gap-6 cards">
          {MOCK_LEVELS.map((level) => (
            <div key={level.id}>
              <LevelCard
                {...level}
                onClick={() => handleLevelClick(level.id)}
              />
            </div>
          ))}
        </div>

        {isModalOpen && userCharacters.length > 0 && selectedLevel && (
          <CharacterSelectionModal
            characters={userCharacters}
            onSelect={handleCharacterSelect}
            onClose={() => setIsModalOpen(false)}
          />
        )}
      </main>
    </div>
  );
}