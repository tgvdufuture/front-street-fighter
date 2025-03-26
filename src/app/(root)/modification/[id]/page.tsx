"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Slider } from "@/components/ui/slider";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Radar } from "@/components/ui/radar";
import { useRouter } from "next/router";
import Navbar from "@/components/shared/Navbar";
import { Upload } from "lucide-react";

interface Character {
  id: number;
  nom: string;
  image: string | null;
  force: number;
  vitesse: number;
  endurance: number;
  power: number;
  combat: number;
}

const stats = [
  { name: "Strength", key: "strength" },
  { name: "Speed", key: "speed" },
  { name: "Durability", key: "durability" },
  { name: "Power", key: "power" },
  { name: "Combat", key: "combat" },
];

export default function EditCharacterPage() {
  const [character, setCharacter] = useState<Character>({
    id: 0,
    nom: "",
    image: null,
    force: 50,
    vitesse: 50,
    endurance: 50,
    power: 50,
    combat: 50,
  });
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchCharacter();
  }, []);

  //   Configurer le router
  //   const router = useRouter();

  const fetchCharacter = async () => {
    setIsLoading(true);
    setError(null);
    try {
      // Faites votre call API Symfony ici
      // mock : données de test en dur
      const mockCharacter: Character = {
        id: 1,
        nom: "Ryu",
        image: "/placeholder.svg",
        force: 80,
        vitesse: 70,
        endurance: 65,
        power: 75,
        combat: 90,
      };
      setCharacter(mockCharacter);
      setIsLoading(false);
    } catch (err) {
      setError("Failed to load character. Please try again later.");
      setIsLoading(false);
    }
  };

  const handleStatChange = (stat: string, value: number[]) => {
    if (character) {
      setCharacter({ ...character, [stat]: value[0] });
    }
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file && character) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setCharacter({ ...character, image: reader.result as string });
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    try {
      const response = await fetch("/api/characters/add", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          image: character.image,
          force: character.force,
          vitesse: character.vitesse,
          endurance: character.endurance,
          power: character.power,
          combat: character.combat,
        }),
      });

      if (!response.ok) {
        throw new Error("Failed to create character");
      }

      const newCharacter = await response.json();
      // Ajoutez le nouveau personnage à l'état ou redirigez
    } catch (error) {
      console.error(error);
    }
  };

  const chartData = character
    ? {
        labels: stats.map((stat) => stat.name),
        datasets: [
          {
            label: "Character Stats",
            data: stats.map(
              (stat) => character[stat.key as keyof Character] as number
            ),
            backgroundColor: "rgba(255, 99, 132, 0.2)",
            borderColor: "rgba(255, 99, 132, 1)",
            borderWidth: 2,
          },
        ],
      }
    : null;

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
          Modification du Combattant
        </motion.h1>

        {isLoading ? (
          <p className="text-center">Chargement des combattants...</p>
        ) : error ? (
          <p className="text-center text-red-500">{error}</p>
        ) : character ? (
          <form onSubmit={handleSubmit} className="max-w-2xl mx-auto">
            <Card className="bg-gray-800 mb-6">
              <CardContent className="pt-6">
                <div className="flex items-center space-x-4 mb-4">
                  <Avatar className="w-20 h-20">
                    <AvatarImage src={character.image as string} alt={character.nom} />
                    <AvatarFallback>
                      {character.nom.slice(0, 2).toUpperCase()}
                    </AvatarFallback>
                  </Avatar>
                  <div>
                    <Label htmlFor="name" className="block mb-2 text-red-500">
                      Nom du combattant
                    </Label>
                    <Input
                      id="name"
                      type="text"
                      name="nom"
                      value={character.nom}
                      onChange={(e) =>
                        setCharacter({ ...character, nom: e.target.value })
                      }
                      required
                      className="w-full bg-gray-700 text-white"
                    />
                  </div>
                </div>
                <div>
                  <Label htmlFor="image" className="block mb-2 text-red-500">
                    Modifier l'image du combattant
                  </Label>
                  <div className="flex items-center justify-center w-full">
                    <label
                      htmlFor="image"
                      className="flex flex-col items-center justify-center w-full h-32 border-2 border-gray-300 border-dashed rounded-lg cursor-pointer bg-gray-700 hover:bg-gray-600"
                    >
                      <div className="flex flex-col items-center justify-center pt-5 pb-6">
                        <Upload className="w-8 h-8 mb-3 text-gray-400" />
                        <p className="mb-2 text-sm text-gray-400">
                          <span className="font-semibold">
                            Clique pour télécharger
                          </span>{" "}
                          ou fais glisser une image ici
                        </p>
                        <p className="text-xs text-gray-400">
                          PNG, JPG or GIF (MAX. 800x400px)
                        </p>
                      </div>
                      <input
                        id="image"
                        type="file"
                        accept="image/*"
                        onChange={handleImageChange}
                        className="hidden"
                      />
                    </label>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="bg-gray-800 mb-6">
              <CardContent className="pt-6">
                <h2 className="text-2xl font-bold mb-4 text-white">
                  Statistiques
                </h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    {stats.map((stat) => (
                      <div key={stat.key} className="mb-4">
                        <Label
                          htmlFor={stat.key}
                          className="block mb-2 text-white"
                        >
                          {stat.name}: {character[stat.key as keyof Character]}
                        </Label>
                        <Slider
                          id={stat.key}
                          min={0}
                          max={100}
                          step={1}
                          value={[
                            character[stat.key as keyof Character] as number,
                          ]}
                          onValueChange={(value) =>
                            handleStatChange(stat.key, value)
                          }
                          className="w-full"
                        />
                      </div>
                    ))}
                  </div>
                  <div className="bg-gray-700 p-4 rounded-lg">
                    {chartData && (
                      <Radar
                        data={chartData}
                        options={{
                          scales: {
                            r: {
                              angleLines: {
                                color: "rgba(255, 255, 255, 0.2)",
                              },
                              grid: {
                                color: "rgba(255, 255, 255, 0.2)",
                              },
                              pointLabels: {
                                color: "rgba(255, 255, 255, 0.7)",
                              },
                              ticks: {
                                color: "rgba(255, 255, 255, 0.7)",
                                backdropColor: "transparent",
                              },
                            },
                          },
                          plugins: {
                            legend: {
                              display: false,
                            },
                          },
                          maintainAspectRatio: false,
                        }}
                        className="w-full h-64"
                      />
                    )}
                  </div>
                </div>
              </CardContent>
            </Card>

            <motion.div
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="flex justify-center"
            >
              <Button
                type="submit"
                className="bg-red-600 hover:bg-red-700 text-white font-bold py-2 px-4 rounded"
              >
                Confirmer les modifications
              </Button>
            </motion.div>
          </form>
        ) : (
          <p className="text-center">Pas de personnages trouvé.</p>
        )}
      </main>
    </div>
  );
}
