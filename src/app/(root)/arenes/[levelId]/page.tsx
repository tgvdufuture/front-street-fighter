"use client";

import { useEffect, useState, useCallback } from "react";
import { useRouter, useSearchParams, useParams } from "next/navigation";
import Link from "next/link";
import Navbar from "@/components/shared/Navbar";
import { CombatState, CharacterStats, CombatLog } from "@/types/combat";

// Fonction pour générer un ennemi basé sur le niveau
const generateEnemy = (level: number): CharacterStats => {
  const baseStats = {
    id: Math.floor(Math.random() * 10000),
    name: `Ennemi Niveau ${level}`,
    strength: 5 * level,
    speed: 5 * level,
    durability: 5 * level,
    power: 5 * level,
    combat: 5 * level,
    health: 100 + (level * 20),
    maxHealth: 100 + (level * 20),
  };

  // Ajout d'un peu d'aléatoire aux stats
  const randomize = (value: number) => Math.max(1, value + Math.floor(Math.random() * 10) - 5);

  return {
    ...baseStats,
    strength: randomize(baseStats.strength),
    speed: randomize(baseStats.speed),
    durability: randomize(baseStats.durability),
    power: randomize(baseStats.power),
    combat: randomize(baseStats.combat),
  };
};

// Composant de chargement
function LoadingScreen({ message }: { message: string }) {
  return (
    <div className="min-h-screen bg-gray-900 text-white">
      <Navbar />
      <div className="container mx-auto p-4">
        <div className="text-center">{message}</div>
      </div>
    </div>
  );
}

// Interface pour les props du composant ArenaContent
interface ArenaContentProps {
  level: number;
  characterId: string | null;
}

// Composant principal de la page d'arène
function ArenaContent({ level, characterId }: ArenaContentProps) {
  const router = useRouter();
  const [character, setCharacter] = useState<CharacterStats | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [combatState, setCombatState] = useState<CombatState | null>(null);
  const [isCombatStarted, setIsCombatStarted] = useState(false);
  const [displayEnemyHealth, setDisplayEnemyHealth] = useState(0);
  const [displayPlayerHealth, setDisplayPlayerHealth] = useState(0);
  const [enemyHealthPercentage, setEnemyHealthPercentage] = useState(100);
  const [playerHealthPercentage, setPlayerHealthPercentage] = useState(100);
  const [damageIndicator, setDamageIndicator] = useState<{target: 'player' | 'enemy', amount: number, isCritical: boolean} | null>(null);
  
  // Mettre à jour les points de vie affichés avec animation
  useEffect(() => {
    if (combatState) {
      // Animation pour les PV de l'ennemi
      const enemy = combatState.enemy;
      const duration = 500; // Durée de l'animation en ms
      const startTime = Date.now();
      const startValue = displayEnemyHealth;
      const endValue = enemy.health;
      
      // Calculer le pourcentage de vie pour la barre de vie
      const startPercentage = (startValue / enemy.maxHealth) * 100;
      const endPercentage = (endValue / enemy.maxHealth) * 100;
      
      if (startValue === endValue) return;
      
      const animate = () => {
        const now = Date.now();
        const progress = Math.min((now - startTime) / duration, 1);
        const currentValue = Math.floor(startValue + (endValue - startValue) * progress);
        const currentPercentage = startPercentage + (endPercentage - startPercentage) * progress;
        
        setDisplayEnemyHealth(currentValue);
        setEnemyHealthPercentage(currentPercentage);
        
        if (progress < 1) {
          requestAnimationFrame(animate);
        }
      };
      
      animate();
    }
  }, [combatState?.enemy.health]);
  
  useEffect(() => {
    if (combatState && character) {
      // Animation pour les PV du joueur
      const player = combatState.player;
      const duration = 500; // Durée de l'animation en ms
      const startTime = Date.now();
      const startValue = displayPlayerHealth;
      const endValue = player.health;
      
      // Calculer le pourcentage de vie pour la barre de vie
      const startPercentage = (startValue / character.maxHealth) * 100;
      const endPercentage = (endValue / character.maxHealth) * 100;
      
      if (startValue === endValue) return;
      
      const animate = () => {
        const now = Date.now();
        const progress = Math.min((now - startTime) / duration, 1);
        const currentValue = Math.floor(startValue + (endValue - startValue) * progress);
        const currentPercentage = startPercentage + (endPercentage - startPercentage) * progress;
        
        setDisplayPlayerHealth(currentValue);
        setPlayerHealthPercentage(currentPercentage);
        
        if (progress < 1) {
          requestAnimationFrame(animate);
        }
      };
      
      animate();
    }
  }, [combatState?.player.health, character]);

  // Fonction pour générer des dégâts aléatoires entre 10 et 50
  const getRandomDamage = useCallback((isEnemy: boolean = false): { damage: number; isCritical: boolean } => {
    // Pour l'ennemi, on utilise une plage de dégâts fixe entre 10 et 50
    // Pour le joueur, on pourrait avoir une formule différente si nécessaire
    const minDamage = 10;
    const maxDamage = 50;
    
    // Générer des dégâts de base entre min et max
    const baseDamage = Math.floor(Math.random() * (maxDamage - minDamage + 1)) + minDamage;
    
    // 15% de chance de coup critique
    const isCritical = Math.random() < 0.15;
    
    // Calculer les dégâts finaux avec bonus de critique
    const finalDamage = isCritical 
      ? Math.floor(baseDamage * 1.5)  // 50% de dégâts en plus en cas de critique
      : baseDamage;
    
    return {
      damage: finalDamage,
      isCritical
    };
  }, []);

  // Fonction pour calculer les dégâts en fonction de la force et de la défense
  const calculateDamage = useCallback((attacker: CharacterStats, defender: CharacterStats, isSpecial: boolean): { damage: number; isCritical: boolean } => {
    // Déterminer si l'attaquant est l'ennemi
    const isEnemy = attacker !== combatState?.player;
    
    // Obtenir les dégâts de base (entre 10 et 50 pour l'ennemi, avec formule similaire pour le joueur)
    const { damage: baseDamage, isCritical } = getRandomDamage(isEnemy);
    
    // Bonus pour les attaques spéciales (20% de dégâts en plus, seulement pour le joueur)
    const damageWithSpecial = (isSpecial && !isEnemy) 
      ? Math.floor(baseDamage * 1.2) 
      : baseDamage;
    
    // Réduction des dégâts basée sur la défense (entre 0% et 50% de réduction)
    const defenseReduction = Math.min(0.5, defender.durability / 200);
    const finalDamage = Math.max(1, Math.floor(damageWithSpecial * (1 - defenseReduction)));
    
    return {
      damage: finalDamage,
      isCritical
    };
  }, [getRandomDamage]);

  // Fonction pour charger le personnage
  useEffect(() => {
    if (!characterId) {
      setError("Aucun personnage sélectionné");
      setIsLoading(false);
      return;
    }

    const fetchCharacter = async () => {
      setIsLoading(true);
      setError(null);
      
      try {
        const token = localStorage.getItem("jwtToken");
        if (!token) {
          window.location.href = "/connexion";
          return;
        }

        const response = await fetch(`https://127.0.0.1:8000/api/characters/${characterId}`, {
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
          throw new Error("Échec du chargement du personnage");
        }


        const characterData = await response.json();
        const player: CharacterStats = {
          ...characterData,
          health: 100 + (characterData.durability * 2),
          maxHealth: 100 + (characterData.durability * 2),
        };
        setCharacter(player);

        // Initialiser l'état du combat
        const enemy = generateEnemy(level);
        setCombatState({
          isFighting: false,
          isPlayerTurn: true,
          player,
          enemy,
          logs: [{ message: `Un ${enemy.name} sauvage apparaît!`, isPlayer: false, isCritical: false, isHeal: false }],
          winner: null,
        });
      } catch (err) {
        setError("Échec du chargement du personnage. Veuillez réessayer.");
        console.error('Failed to load character:', err);
      } finally {
        setIsLoading(false);
      }
    };

    fetchCharacter();
  }, [characterId, level]);

  // Fonction pour afficher l'indicateur de dégâts
  const showDamageIndicator = (target: 'player' | 'enemy', amount: number, isCritical: boolean) => {
    setDamageIndicator({ target, amount, isCritical });
    setTimeout(() => setDamageIndicator(null), 1000); // Masquer après 1 seconde
  };

  // Fonction pour gérer l'attaque du joueur
  const handleAttack = useCallback((isSpecial = false) => {
    if (!combatState || !combatState.isPlayerTurn || combatState.winner) return;

    // Désactiver les boutons pendant l'attaque
    setCombatState(prevState => ({
      ...prevState!,
      isPlayerTurn: false
    }));

    // Attendre un court instant avant de commencer l'attaque
    setTimeout(() => {
      setCombatState(prevState => {
        if (!prevState) return null;
        
        const { player, enemy, logs } = prevState;
        const newLogs = [...logs];
        
        // Attaque du joueur
        const { damage, isCritical } = calculateDamage(player, enemy, isSpecial);
        const newEnemyHealth = Math.max(0, enemy.health - damage);
        
        // Afficher l'indicateur de dégâts sur l'ennemi
        showDamageIndicator('enemy', damage, isCritical);
        
        // Message d'attaque avec gestion des critiques et attaques spéciales
        let attackMessage = '';
        if (isSpecial) {
          attackMessage = isCritical
            ? `${player.name} utilise une attaque spéciale CRITIQUE et inflige ${damage} points de dégâts!`
            : `${player.name} utilise une attaque spéciale et inflige ${damage} points de dégâts!`;
        } else {
          attackMessage = isCritical
            ? `${player.name} porte un coup CRITIQUE et inflige ${damage} points de dégâts!`
            : `${player.name} attaque et inflige ${damage} points de dégâts!`;
        }
        
        newLogs.push({
          message: attackMessage,
          isPlayer: true,
          isCritical,
          isHeal: false
        });

        // Vérifier si l'ennemi est vaincu
        if (newEnemyHealth <= 0) {
          newLogs.push({
            message: `${enemy.name} est vaincu!`,
            isPlayer: true,
            isCritical: false,
            isHeal: false
          });
          
          return {
            ...prevState,
            enemy: { ...enemy, health: 0 },
            logs: newLogs,
            winner: 'player' as const,
            isFighting: false,
            isPlayerTurn: false
          };
        }

        // Mettre à jour les points de vie de l'ennemi
        const updatedState = {
          ...prevState,
          enemy: { ...enemy, health: newEnemyHealth },
          logs: newLogs,
          isPlayerTurn: false
        };

        // Planifier la contre-attaque de l'ennemi après un délai
        setTimeout(() => {
          setCombatState(prevState => {
            if (!prevState) return null;
            
            const { player, enemy: currentEnemy, logs: currentLogs } = prevState;
            const newEnemyLogs = [...currentLogs];
            
            // Tour de l'ennemi
            const { damage: enemyDamage, isCritical: isEnemyCritical } = calculateDamage(
              { ...currentEnemy, health: newEnemyHealth }, // Utiliser les PV mis à jour
              player, 
              false
            );
            
            const newPlayerHealth = Math.max(0, player.health - enemyDamage);
            
            // Afficher l'indicateur de dégâts sur le joueur
            showDamageIndicator('player', enemyDamage, isEnemyCritical);
            
            // Message de contre-attaque avec gestion des critiques
            const enemyAttackMessage = isEnemyCritical
              ? `${currentEnemy.name} porte un coup CRITIQUE et inflige ${enemyDamage} points de dégâts!`
              : `${currentEnemy.name} contre-attaque et inflige ${enemyDamage} points de dégâts!`;
            
            newEnemyLogs.push({
              message: enemyAttackMessage,
              isPlayer: false,
              isCritical: isEnemyCritical,
              isHeal: false
            });

            // Vérifier si le joueur est vaincu
            if (newPlayerHealth <= 0) {
              newEnemyLogs.push({
                message: `${player.name} a été vaincu!`,
                isPlayer: false,
                isCritical: false,
                isHeal: false
              });
              
              return {
                ...prevState,
                player: { ...player, health: 0 },
                logs: newEnemyLogs,
                winner: 'enemy' as const,
                isFighting: false,
                isPlayerTurn: false
              };
            }
            
            // Mettre à jour les points de vie du joueur et réactiver le tour du joueur
            return {
              ...prevState,
              player: { ...player, health: newPlayerHealth },
              logs: newEnemyLogs,
              isPlayerTurn: true
            };
          });
        }, 1000); // Délai avant la contre-attaque de l'ennemi

        return updatedState;
      });
    }, 300); // Délai avant le début de l'attaque du joueur
  }, [combatState, calculateDamage]);

  // Fonction pour démarrer le combat
  const startCombat = () => {
    if (!combatState) return;
    
    setCombatState(prevState => {
      if (!prevState) return null;
      return {
        ...prevState,
        isFighting: true,
        logs: [...prevState.logs, { message: "Le combat commence!", isPlayer: true, isCritical: false, isHeal: false }]
      };
    });
  };

  // Fonction pour recommencer le combat
  const restartCombat = () => {
    if (!character) return;
    
    const newEnemy = generateEnemy(level);
    setCombatState({
      isFighting: false,
      isPlayerTurn: true,
      player: {
        ...character,
        health: character.maxHealth,
      },
      enemy: newEnemy,
      logs: [{ message: `Un ${newEnemy.name} sauvage apparaît!`, isPlayer: false, isCritical: false, isHeal: false }],
      winner: null,
    });
  };

  // Afficher l'état de chargement
  if (isLoading) {
    return <LoadingScreen message="Chargement de l'arène..." />;
  }

  // Afficher les erreurs
  if (error) {
    return (
      <div className="min-h-screen bg-gray-900 text-white">
        <Navbar />
        <div className="container mx-auto p-4">
          <div className="text-center text-red-500">{error}</div>
          <div className="mt-4 text-center">
            <a
              href="/arenes"
              className="px-4 py-2 bg-blue-600 rounded hover:bg-blue-700"
            >
              Retour aux arènes
            </a>
          </div>
        </div>
      </div>
    );
  }

  if (!character || !combatState) {
    return (
      <div className="min-h-screen bg-gray-900 text-white">
        <Navbar />
        <div className="container mx-auto p-4">
          <div className="text-center text-red-500">Erreur lors du chargement de l'arène</div>
          <div className="mt-4 text-center">
            <a
              href="/arenes"
              className="px-4 py-2 bg-blue-600 rounded hover:bg-blue-700"
            >
              Retour aux arènes
            </a>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-900 text-white relative">
      <Navbar />
      <div className="container mx-auto p-4">
        <h1 className="text-3xl font-bold text-center mb-8">
          Arène Niveau {level}
        </h1>
        
        {/* Zone de combat */}
        <div className="max-w-4xl mx-auto bg-gray-800 rounded-lg shadow-lg p-6 min-h-[60vh] flex flex-col">
          {/* Image de l'ennemi en grand */}
          <div className="relative w-full h-64 mb-4 overflow-hidden rounded-lg">
            <img 
              src={`/images/enemies/enemy-${level}.png`} 
              alt={combatState.enemy.name}
              className="w-full h-full object-cover"
              onError={(e) => {
                (e.target as HTMLImageElement).src = '/images/enemies/default-enemy.png';
              }}
            />
            {/* Infos sur l'image */}
            <div className="absolute bottom-0 left-0 right-0 bg-black bg-opacity-70 p-2">
              <div className="flex justify-between items-center text-white">
                <h2 className="text-lg font-bold">{combatState.enemy.name}</h2>
                <div className="flex items-center">
                  <span className="text-sm mr-2">
                    {Math.max(0, displayEnemyHealth)} / {combatState.enemy.maxHealth} PV
                  </span>
                  {damageIndicator?.target === 'enemy' && (
                    <span className={`text-sm font-bold ${damageIndicator.isCritical ? 'text-yellow-400' : 'text-red-400'} animate-bounce`}>
                      -{damageIndicator.amount}
                    </span>
                  )}
                </div>
              </div>
              <div className="w-full bg-gray-700 rounded-full h-2.5 mt-1 overflow-hidden">
                <div 
                  className={`h-full rounded-full ${
                    (combatState.enemy.health / combatState.enemy.maxHealth) < 0.3 
                      ? 'bg-red-500' 
                      : 'bg-green-500'
                  }`}
                  style={{ 
                    width: `${enemyHealthPercentage}%`,
                    transition: 'width 0.3s ease-out, background-color 0.3s ease-out',
                  }}
                />
              </div>
            </div>
          </div>

          {/* Zone de texte du combat */}
          <div className="bg-gray-800 rounded-lg p-4 mb-4 flex-1 overflow-y-auto max-h-48 flex-grow">
            {combatState.logs.map((log, index) => (
              <div 
                key={index} 
                className={`text-sm mb-1 ${
                  log.isCritical ? 'text-yellow-400 font-bold' : 
                  log.isHeal ? 'text-green-400' : 
                  log.isPlayer ? 'text-blue-300' : 'text-white'
                }`}
              >
                {log.message}
              </div>
            ))}
          </div>

          {/* Boutons d'action */}
          <div className="flex flex-wrap gap-2 justify-center">
            {combatState.winner ? (
              <>
                <div className="w-full text-center mb-4">
                  <h2 className={`text-2xl font-bold ${combatState.winner === 'player' ? 'text-green-500' : 'text-red-500'}`}>
                    {combatState.winner === 'player' ? 'Victoire !' : 'Défaite...'}
                  </h2>
                  {combatState.winner === 'player' ? (
                    <p className="text-gray-300">Vous avez vaincu {combatState.enemy.name} !</p>
                  ) : (
                    <p className="text-gray-300">Vous avez été vaincu par {combatState.enemy.name}.</p>
                  )}
                </div>
                <div className="flex gap-4 w-full justify-center">
                  <button
                    onClick={restartCombat}
                    className="px-6 py-2 bg-blue-600 rounded hover:bg-blue-700 transition-colors"
                  >
                    {combatState.winner === 'player' ? 'Niveau suivant' : 'Réessayer'}
                  </button>
                  <button
                    onClick={() => router.push('/arenes')}
                    className="px-6 py-2 bg-gray-600 rounded hover:bg-gray-700 transition-colors"
                  >
                    Retour aux arènes
                  </button>
                </div>
              </>
            ) : (
              <>
                {!combatState.isFighting ? (
                  <button
                    onClick={startCombat}
                    className="px-4 py-2 bg-blue-600 rounded hover:bg-blue-700"
                  >
                    Commencer le combat
                  </button>
                ) : (
                  <>
                    <button
                      onClick={() => handleAttack(false)}
                      disabled={!combatState.isPlayerTurn}
                      className={`px-4 py-2 rounded ${
                        combatState.isPlayerTurn 
                          ? 'bg-red-600 hover:bg-red-700' 
                          : 'bg-gray-600 cursor-not-allowed'
                      }`}
                    >
                      Attaquer
                    </button>
                    <button
                      onClick={() => handleAttack(true)}
                      disabled={!combatState.isPlayerTurn}
                      className={`px-4 py-2 rounded ${
                        combatState.isPlayerTurn 
                          ? 'bg-yellow-600 hover:bg-yellow-700' 
                          : 'bg-gray-600 cursor-not-allowed'
                      }`}
                    >
                      Attaque spéciale
                    </button>
                  </>
                )}
                <button
                  onClick={() => router.push('/arenes')}
                  className="px-4 py-2 bg-gray-600 rounded hover:bg-gray-700"
                >
                  Fuir
                </button>
              </>
            )}
          </div>
        </div>
      </div>
      
      {/* Barre de vie du joueur en bas à gauche */}
      <div className="fixed bottom-4 left-4 bg-gray-800 bg-opacity-90 rounded-lg p-3 w-64">
        <div className="flex justify-between items-center mb-1">
          <h3 className="font-bold">{character.name}</h3>
          <div className="flex items-center">
            <span className="text-sm mr-2">
              {Math.max(0, displayPlayerHealth)} / {character.maxHealth} PV
            </span>
            {damageIndicator?.target === 'player' && (
              <span className={`text-sm font-bold ${damageIndicator.isCritical ? 'text-yellow-400' : 'text-red-400'} animate-bounce`}>
                -{damageIndicator.amount}
              </span>
            )}
          </div>
        </div>
        <div className="w-full bg-gray-700 rounded-full h-3 overflow-hidden">
          <div 
            className={`h-full rounded-full ${
              (character.health / character.maxHealth) < 0.3 
                ? 'bg-red-500' 
                : 'bg-blue-500'
            }`}
            style={{ 
              width: `${playerHealthPercentage}%`,
              transition: 'width 0.3s ease-out, background-color 0.3s ease-out',
            }}
          />
        </div>
      </div>
    </div>
  );
}



// Composant de page principal
export default function ArenaPage() {
  const params = useParams();
  const router = useRouter();
  const searchParams = useSearchParams();
  const characterId = searchParams.get('character');
  
  // Vérifier si le niveau est valide
  const level = parseInt(Array.isArray(params.levelId) ? params.levelId[0] : params.levelId, 10);
  
  // Utiliser un effet pour la redirection
  useEffect(() => {
    if (isNaN(level) || level < 1) {
      router.push('/arenes');
    }
  }, [level, router]);
  
  // Afficher un écran de chargement pendant la redirection
  if (isNaN(level) || level < 1) {
    return <LoadingScreen message="Redirection..." />;
  }

  return <ArenaContent level={level} characterId={characterId} />;
}
