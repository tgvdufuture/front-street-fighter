import React from 'react';

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

interface CharacterSelectionModalProps {
  characters: UserCharacter[];
  onSelect: (characterId: number) => void;
  onClose: () => void;
}

const CharacterSelectionModal: React.FC<CharacterSelectionModalProps> = ({ characters, onSelect, onClose }) => {
  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-[rgb(40,52,68)] p-6 rounded-lg shadow-xl w-full max-w-md mx-4">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-2xl font-semibold text-white">Choisis ton Personnage</h2>
          <button onClick={onClose} className="text-gray-300 hover:text-white text-2xl">&times;</button>
        </div>
        <div className="space-y-3 max-h-[60vh] overflow-y-auto">
          {characters.map((character) => (
            <div
              key={character.id}
              onClick={() => onSelect(character.id)}
              className="flex items-center p-3 bg-[rgb(55,65,81)] rounded-md hover:bg-[rgb(65,75,91)] cursor-pointer transition-colors duration-150"
            >
              {character.image && (
                <img 
                  src={character.image.startsWith('http') ? character.image : `http://localhost:8000${character.image}`} 
                  alt={character.name} 
                  className="w-16 h-16 rounded-full mr-4 object-cover border-2 border-gray-500"
                />
              )}
              {!character.image && (
                <div className="w-16 h-16 rounded-full mr-4 bg-gray-500 flex items-center justify-center text-white text-xl font-bold border-2 border-gray-400">
                  {character.name.charAt(0).toUpperCase()}
                </div>
              )}
              <span className="text-lg text-white font-medium">{character.name}</span>
            </div>
          ))}
        </div>
        {characters.length === 0 && (
            <p className="text-center text-gray-400 mt-4">Aucun personnage trouvé.</p>
        )}
      </div>
    </div>
  );
};

export default CharacterSelectionModal;
