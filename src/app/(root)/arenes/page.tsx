'use client';

import { useEffect, useState } from 'react';

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

export default function ArenaPage() {
  const [characters, setCharacters] = useState<Character[]>([]);
  const [selectedCharacter1, setSelectedCharacter1] = useState<number | undefined>(undefined);
  const [selectedCharacter2, setSelectedCharacter2] = useState<number | undefined>(undefined);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchCharacters();
  }, []);

  const fetchCharacters = async () => {
    try {
      const response = await fetch('http://127.0.0.1:8080/api/characters', {
        headers: {
          'Content-Type': 'application/json',
        },
        mode: 'cors',
        credentials: 'include'
      });

      if (!response.ok) {
        throw new Error('Failed to fetch characters');
      }

      const data = await response.json();
      setCharacters(data);
      setError(null);
    } catch (error) {
      console.error('Error fetching characters:', error);
      setError('Erreur lors du chargement des personnages');
    }
  };

  if (error) {
    return (
      <div className="container mx-auto p-6">
        <h1 className="text-3xl font-bold mb-8 text-center">Arènes de Combat</h1>
        <div className="text-center text-red-600">
          {error}
        </div>
      </div>
    );
  }

  if (characters.length === 0) {
    return (
      <div className="container mx-auto p-6">
        <h1 className="text-3xl font-bold mb-8 text-center">Arènes de Combat</h1>
        <div className="text-center text-gray-500">
          Aucun personnage trouvé. Veuillez créer des personnages.
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto p-6">
      <h1 className="text-3xl font-bold mb-8 text-center">Arènes de Combat</h1>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-white rounded-lg shadow-md p-6">
          <h2 className="text-xl font-semibold mb-4">Personnage 1</h2>
          <select
            value={selectedCharacter1}
            onChange={(e) => setSelectedCharacter1(Number(e.target.value) || undefined)}
            className="w-full p-2 border rounded"
            required
          >
            <option value="">Choisir un personnage</option>
            {characters.map((character) => (
              <option key={character.id} value={character.id}>
                {character.name} (Force: {character.strength}, Combat: {character.combat})
              </option>
            ))}
          </select>
        </div>

        <div className="bg-white rounded-lg shadow-md p-6">
          <h2 className="text-xl font-semibold mb-4">Personnage 2</h2>
          <select
            value={selectedCharacter2}
            onChange={(e) => setSelectedCharacter2(Number(e.target.value) || undefined)}
            className="w-full p-2 border rounded"
            required
          >
            <option value="">Choisir un personnage</option>
            {characters.map((character) => (
              <option key={character.id} value={character.id}>
                {character.name} (Force: {character.strength}, Combat: {character.combat})
              </option>
            ))}
          </select>
        </div>
      </div>

      <div className="mt-8">
        <button
          onClick={() => {
            if (!selectedCharacter1 || !selectedCharacter2) return;
            if (selectedCharacter1 === selectedCharacter2) {
              alert('Vous ne pouvez pas faire combattre le même personnage contre lui-même !');
              return;
            }
            // Ici, vous pouvez ajouter la logique pour démarrer le combat
            console.log('Combat entre:', selectedCharacter1, 'et', selectedCharacter2);
          }}
          className="w-full bg-blue-500 text-white py-3 px-6 rounded hover:bg-blue-600 disabled:opacity-50"
          disabled={loading || !selectedCharacter1 || !selectedCharacter2 || selectedCharacter1 === selectedCharacter2}
        >
          {loading ? 'Combat en cours...' : 'Commencer le combat !'}
        </button>
      </div>
    </div>
  );
}
