import { useState, ChangeEvent, FormEvent, useEffect } from "react";
import { motion } from "framer-motion";
import { Slider } from "@/components/ui/slider";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Upload } from "lucide-react";
import Characters from "./Characters";

const stats = [
  { name: "Force", key: "force" },
  { name: "Vitesse", key: "vitesse" },
  { name: "Endurance", key: "endurance" },
  { name: "Power", key: "power" },
  { name: "Combat", key: "combat" },
];

interface CharacterFormProps {
  onSubmit: (data: {
    nom: string;
    force: number;
    vitesse: number;
    endurance: number;
    power: number;
    combat: number;
  }) => void;
  initialData?: {
    nom: string;
    force: number;
    vitesse: number;
    endurance: number;
    power: number;
    combat: number;
  };
}

export default function CharacterForm({ onSubmit, initialData }: CharacterFormProps) {
  const [character, setCharacter] = useState({
    nom: initialData?.nom || '',
    force: initialData?.force || 0,
    vitesse: initialData?.vitesse || 0,
    endurance: initialData?.endurance || 0,
    power: initialData?.power || 0,
    combat: initialData?.combat || 0,
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(character);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div>
        <label htmlFor="nom" className="block text-sm font-medium text-gray-700">
          Nom
        </label>
        <input
          type="text"
          id="nom"
          value={character.nom}
          onChange={(e) => setCharacter({ ...character, nom: e.target.value })}
          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
          required
        />
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div>
          <label htmlFor="force" className="block text-sm font-medium text-gray-700">
            Force
          </label>
          <input
            type="number"
            id="force"
            value={character.force}
            onChange={(e) => setCharacter({ ...character, force: Number(e.target.value) })}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
            min="0"
            max="100"
            required
          />
        </div>

        <div>
          <label htmlFor="vitesse" className="block text-sm font-medium text-gray-700">
            Vitesse
          </label>
          <input
            type="number"
            id="vitesse"
            value={character.vitesse}
            onChange={(e) => setCharacter({ ...character, vitesse: Number(e.target.value) })}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
            min="0"
            max="100"
            required
          />
        </div>

        <div>
          <label htmlFor="endurance" className="block text-sm font-medium text-gray-700">
            Endurance
          </label>
          <input
            type="number"
            id="endurance"
            value={character.endurance}
            onChange={(e) => setCharacter({ ...character, endurance: Number(e.target.value) })}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
            min="0"
            max="100"
            required
          />
        </div>

        <div>
          <label htmlFor="power" className="block text-sm font-medium text-gray-700">
            Power
          </label>
          <input
            type="number"
            id="power"
            value={character.power}
            onChange={(e) => setCharacter({ ...character, power: Number(e.target.value) })}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
            min="0"
            max="100"
            required
          />
        </div>

        <div>
          <label htmlFor="combat" className="block text-sm font-medium text-gray-700">
            Combat
          </label>
          <input
            type="number"
            id="combat"
            value={character.combat}
            onChange={(e) => setCharacter({ ...character, combat: Number(e.target.value) })}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
            min="0"
            max="100"
            required
          />
        </div>
      </div>

      <div className="flex justify-end">
        <button
          type="submit"
          className="inline-flex justify-center rounded-md border border-transparent bg-indigo-600 py-2 px-4 text-sm font-medium text-white shadow-sm hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
        >
          {initialData ? 'Modifier' : 'Créer'}
        </button>
      </div>
    </form>
  );
}
