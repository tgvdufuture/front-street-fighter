import { useState, ChangeEvent, FormEvent } from "react";
import { motion } from "framer-motion";
import { Slider } from "@/components/ui/slider";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Upload } from "lucide-react";

const stats = [
  { name: "Force", key: "force" },
  { name: "Vitesse", key: "vitesse" },
  { name: "Endurance", key: "endurance" },
  { name: "Power", key: "power" },
  { name: "Combat", key: "combat" },
];

type CharacterFormProps = {
  onSubmit: (character: {
    nom: string;
    image: string | ArrayBuffer | null;
    force: number;
    vitesse: number;
    endurance: number;
    power: number;
    combat: number;
  }) => void;
};

export default function CharacterForm({ onSubmit }: CharacterFormProps) {
  const [character, setCharacter] = useState({
    nom: "",
    image: null as string | ArrayBuffer | null,
    force: 50,
    vitesse: 50,
    endurance: 50,
    power: 50,
    combat: 50,
  });

  // Gestion des statistiques
  const handleStatChange = (stat: string, value: number[]) => {
    setCharacter((prev) => ({ ...prev, [stat]: value[0] }));
  };

  // Gestion de l'image du personnage
  const handleImageChange = (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setCharacter((prev) => ({ ...prev, image: reader.result }));
      };
      reader.readAsDataURL(file);
    }
  };

  // Soumission du formulaire
  const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    onSubmit(character);
  };

  return (
    <form onSubmit={handleSubmit} className="max-w-2xl mx-auto">
      {/* Nom du combattant */}
      <div className="mb-6">
        <Label htmlFor="name" className="block mb-2">
          Nom du combattant
        </Label>
        <Input
          id="name"
          type="text"
          value={character.nom}
          onChange={(e) =>
            setCharacter((prev) => ({ ...prev, name: e.target.value }))
          }
          required
          className="w-full bg-gray-800 text-white"
        />
      </div>

      {/* Image du combattant */}
      <div className="mb-6">
        <Label htmlFor="image" className="block mb-2">
          Image de votre combattant
        </Label>
        <div className="flex items-center justify-center w-full">
          <label
            htmlFor="image"
            className="flex flex-col items-center justify-center w-full h-64 border-2 border-gray-300 border-dashed rounded-lg cursor-pointer bg-gray-700 hover:bg-gray-600"
          >
            {character.image ? (
              <img
                src={character.image as string}
                alt="Character Preview"
                className="w-full h-full object-cover rounded-lg"
              />
            ) : (
              <div className="flex flex-col items-center justify-center pt-5 pb-6">
                <Upload className="w-10 h-10 mb-3 text-gray-400" />
                <p className="mb-2 text-sm text-gray-400">
                  <span className="font-semibold">
                    Cliquez pour télécharger
                  </span>{" "}
                  ou faites glisser une image ici
                </p>
                <p className="text-xs text-gray-400">
                  PNG, JPG ou GIF (MAX. 800x400px)
                </p>
              </div>
            )}
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

      {/* Statistiques du combattant */}
      <div className="mb-6">
        <h2 className="text-2xl font-bold mb-4">Statistiques du combattant</h2>
        {stats.map((stat) => (
          <div key={stat.key} className="mb-4">
            <Label htmlFor={stat.key} className="block mb-2">
              {stat.name}:{" "}
              {String(character[stat.key as keyof typeof character])}
            </Label>
            <Slider
              id={stat.key}
              min={0}
              max={100}
              step={1}
              value={[character[stat.key as keyof typeof character] as number]}
              onValueChange={(value) => handleStatChange(stat.key, value)}
              className="w-full bg-white"
            />
          </div>
        ))}
      </div>

      {/* Bouton de soumission */}
      <motion.div
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        className="flex justify-center"
      >
        <Button
          type="submit"
          className="bg-red-600 hover:bg-red-700 text-white font-bold py-2 px-4 rounded"
        >
          Créer votre combattant
        </Button>
      </motion.div>
    </form>
  );
}
