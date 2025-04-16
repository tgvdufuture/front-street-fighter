"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { Slider } from "@/components/ui/slider";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Radar } from "@/components/ui/radar";
import { useRouter } from "next/navigation";
import Navbar from "@/components/shared/Navbar";
import { Upload } from "lucide-react";

type StatKey = 'force' | 'dexterite' | 'constitution' | 'intelligence' | 'sagesse' | 'charisme' | 'combat';

interface StatType {
  name: string;
  key: StatKey;
}

interface Character {
  nom: string;
  force: number;
  dexterite: number;
  constitution: number;
  intelligence: number;
  sagesse: number;
  charisme: number;
  combat: number;
  imageFile?: File;
  imagePreview?: string;
}

const stats: StatType[] = [
  { name: "Force", key: "force" },
  { name: "Dexterité", key: "dexterite" },
  { name: "Constitution", key: "constitution" },
  { name: "Intelligence", key: "intelligence" },
  { name: "Sagesse", key: "sagesse" },
  { name: "Charisme", key: "charisme" },
  { name: "Combat", key: "combat" },
];

const initialCharacter: Character = {
  nom: "",
  force: 50,
  dexterite: 50,
  constitution: 50,
  intelligence: 50,
  sagesse: 50,
  charisme: 50,
  combat: 50,
};

export default function CreationPage() {
  const router = useRouter();
  const [character, setCharacter] = useState<Character>(initialCharacter);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  const handleStatChange = (key: StatKey, value: number[]) => {
    setCharacter((prev) => ({
      ...prev,
      [key]: value[0],
    }));
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        const previewUrl = reader.result as string;
        setImagePreview(previewUrl);
        setCharacter(prev => ({ ...prev, imageFile: file }));
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const token = localStorage.getItem('jwtToken');
      if (!token) {
        router.push('/connexion');
        return;
      }

      const response = await fetch("https://127.0.0.1:8000/api/characters/add", {
        method: "POST",
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          name: character.nom,
          strength: character.force,
          speed: character.dexterite,
          durability: character.constitution,
          power: character.intelligence,
          combat: character.combat
        })
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || "Erreur lors de la création du personnage");
      }

      router.push('/personnages');
    } catch (err) {
      setError(err instanceof Error ? err.message : "Erreur lors de la création du personnage. Veuillez réessayer.");
    }
  };

  const chartData = {
    labels: stats.map((stat) => stat.name),
    datasets: [
      {
        label: "Character Stats",
        data: stats.map((stat) => character[stat.key as keyof Character] as number),
        backgroundColor: "rgba(255, 99, 132, 0.2)",
        borderColor: "rgba(255, 99, 132, 1)",
        borderWidth: 2,
      },
    ],
  };

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
          Création d'un Combattant
        </motion.h1>

        {error ? (
          <p className="text-center text-red-500">{error}</p>
        ) : (
          <form onSubmit={handleSubmit} className="max-w-2xl mx-auto">
            <Card className="bg-gray-800 mb-6">
              <CardContent className="pt-6">
                <div className="flex items-center space-x-4 mb-4">
                  <div className="relative">
                    <Avatar className="h-24 w-24">
                      {imagePreview ? (
                        <AvatarImage src={imagePreview} alt={character.nom || "Avatar"} />
                      ) : (
                        <AvatarFallback>{character.nom?.[0]?.toUpperCase() || "?"}</AvatarFallback>
                      )}
                    </Avatar>
                    <label
                      htmlFor="image-upload"
                      className="absolute bottom-0 right-0 bg-red-600 p-1 rounded-full cursor-pointer hover:bg-red-700"
                    >
                      <Upload className="w-4 h-4 text-white" />
                    </label>
                    <input
                      id="image-upload"
                      type="file"
                      accept="image/*"
                      onChange={handleImageChange}
                      className="hidden"
                    />
                  </div>
                  <div>
                    <Label htmlFor="name" className="block mb-2 text-red-500">
                      Nom du combattant
                    </Label>
                    <Input
                      id="name"
                      type="text"
                      name="name"
                      value={character.nom}
                      onChange={(e) =>
                        setCharacter({ ...character, nom: e.target.value })
                      }
                      required
                      className="w-full bg-gray-700 text-white"
                    />
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
                          {stat.name}: {character[stat.key]}
                        </Label>
                        <Slider
                          id={stat.key}
                          min={0}
                          max={100}
                          step={1}
                          value={[character[stat.key] || 0]}
                          onValueChange={(value) => handleStatChange(stat.key as StatKey, value)}
                          className="w-full"
                        />
                      </div>
                    ))}
                  </div>
                  <div className="bg-gray-700 p-4 rounded-lg">
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
                Créer le combattant
              </Button>
            </motion.div>
          </form>
        )}
      </main>
    </div>
  );
}
