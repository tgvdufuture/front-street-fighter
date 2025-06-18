"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Slider } from "@/components/ui/slider";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Radar } from "@/components/ui/radar";
import { useRouter } from "next/navigation";
import Navbar from "@/components/shared/Navbar";
import { Upload } from "lucide-react";

interface Character {
  nom: string;
  force: number;
  vitesse: number;
  endurance: number;
  puissance: number;
  combat: number;
  image?: File;
  imageUrl?: string;
}

type CharacterStats = Pick<Character, 'force' | 'vitesse' | 'endurance' | 'puissance' | 'combat'>;

interface Stat {
  name: string;
  key: keyof CharacterStats;
}

const stats: Stat[] = [
  { name: "Force", key: "force" },
  { name: "Vitesse", key: "vitesse" },
  { name: "Endurance", key: "endurance" },
  { name: "Puissance", key: "puissance" },
  { name: "Combat", key: "combat" },
];

export default function ModificationPage({ params }: { params: { id: string } }) {
  const router = useRouter();
  const [character, setCharacter] = useState<Character | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [isEditing, setIsEditing] = useState(false);
  const [chartData, setChartData] = useState<any>(null);

  const fetchCharacter = async () => {
    try {
      const token = localStorage.getItem('jwtToken');
      console.log('Token:', token); // Debug log

      if (!token) {
        console.log('Pas de token trouvé, redirection vers /connexion'); // Debug log
        router.push('/connexion');
        return;
      }

      console.log('Tentative de récupération du personnage avec ID:', params.id); // Debug log
      const response = await fetch(`https://127.0.0.1:8000/api/characters/${params.id}`, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });

      console.log('Statut de la réponse:', response.status); // Debug log

      if (!response.ok) {
        if (response.status === 401) {
          console.log('Token invalide, redirection vers /connexion'); // Debug log
          router.push('/connexion');
          return;
        }
        const errorData = await response.json();
        throw new Error(errorData.error || 'Erreur lors de la récupération du personnage');
      }

      const data = await response.json();
      console.log('Structure complète des données reçues:', data); // Debug log

      // Créer les données pour le graphique radar
      const chartData = {
        labels: stats.map(stat => stat.name),
        datasets: [
          {
            label: 'Statistiques',
            data: stats.map(stat => data[stat.key]),
            backgroundColor: 'rgba(255, 99, 132, 0.2)',
            borderColor: 'rgba(255, 99, 132, 1)',
            borderWidth: 1
          }
        ]
      };

      const imageUrl = data.image?.startsWith('/') ? `https://127.0.0.1:8000${data.image}` : data.image;
      setCharacter({
        nom: data.name,
        force: data.strength,
        vitesse: data.speed,
        endurance: data.durability,
        puissance: data.power,
        combat: data.combat,
        imageUrl: imageUrl
      });
      setChartData(chartData);
      if (data.image) {
        setImagePreview(data.image);
      }
      setIsEditing(true);
    } catch (err) {
      console.error('Erreur détaillée:', err); // Debug log
      setError(err instanceof Error ? err.message : 'Une erreur est survenue');
    }
  };

  useEffect(() => {
    // Charger les données au chargement initial
    fetchCharacter();
  }, [params.id, router]);

  const handleEditClick = () => {
    // Réinitialiser l'état d'édition
    setIsEditing(!isEditing);
  };

  const handleStatChange = (stat: keyof CharacterStats, value: number[]) => {
    if (character) {
      setCharacter({ ...character, [stat]: value[0] });
    }
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file && character) {
      const updatedCharacter = { ...character, image: file };
      setCharacter(updatedCharacter);
      
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!character) return;

    try {
      const token = localStorage.getItem('jwtToken');
      if (!token) {
        router.push('/connexion');
        return;
      }

      // Créer un FormData avec les données attendues par l'API
      const formData = new FormData();
      formData.append('name', character.nom);
      formData.append('strength', character.force.toString());
      formData.append('speed', character.vitesse.toString());
      formData.append('durability', character.endurance.toString());
      formData.append('power', character.puissance.toString());
      formData.append('combat', character.combat.toString());
      
      // Gestion de l'image
      if (character.image instanceof File) {
        formData.append('image', character.image, character.image.name);
      }

      const response = await fetch(`https://127.0.0.1:8000/api/characters/${params.id}`, {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${token}`
        },
        body: formData
      });

      console.log('Statut de la réponse POST:', response.status);
      
      if (!response.ok) {
        const errorData = await response.json();
        console.error('Erreur de l\'API:', errorData);
        throw new Error(errorData.error || 'Erreur lors de la mise à jour du personnage');
      }
      const data = await response.json();
      console.log('Structure complète des données reçues:', data); // Debug log

      router.push('/personnages');
    } catch (err) {
      console.error('Erreur détaillée:', err);
      setError(err instanceof Error ? err.message : 'Une erreur est survenue lors de la mise à jour');
    }
  };

  if (!character) {
    return <div className="container mx-auto px-4 py-8">Chargement...</div>;
  }

  return (
    <div className="min-h-screen bg-gray-900">
      <Navbar />
      <main className="container mx-auto px-4 py-8">
        {error ? (
          <p className="text-center text-red-500">{error}</p>
        ) : (
          character && isEditing ? (
            <form onSubmit={handleSubmit} className="max-w-2xl mx-auto">
              <Card className="bg-gray-800 mb-6">
                <CardContent className="pt-6">
                  <div className="flex items-center space-x-4 mb-4">
                    <div className="relative">
                      <Avatar className="w-20 h-20">
                        {imagePreview ? (
                          <img 
                            src={imagePreview?.startsWith('/') ? `https://127.0.0.1:8000${imagePreview}` : imagePreview} 
                            alt="Aperçu" 
                            className="w-full h-full object-cover rounded-full" 
                          />
                        ) : (
                          <AvatarFallback>
                            {character.nom.slice(0, 2).toUpperCase()}
                          </AvatarFallback>
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
                            value={[character[stat.key]]}
                            onValueChange={(value) => handleStatChange(stat.key, value)}
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
            <div className="flex justify-center">
              <Button
                onClick={handleEditClick}
                className="bg-red-600 hover:bg-red-700 text-white font-bold py-2 px-4 rounded"
              >
                Modifier le personnage
              </Button>
            </div>
          )
        )}
      </main>
    </div>
  );
}
