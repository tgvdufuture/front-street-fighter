export interface CharacterStats {
  id: number;
  name: string;
  strength: number;
  speed: number;
  durability: number;
  power: number;
  combat: number;
  health: number;
  maxHealth: number;
  image?: string | null;
}

export interface CombatLog {
  message: string;
  isPlayer: boolean;
  isCritical: boolean;
  isHeal: boolean;
}

export interface CombatState {
  isFighting: boolean;
  isPlayerTurn: boolean;
  player: CharacterStats;
  enemy: CharacterStats;
  logs: CombatLog[];
  winner: 'player' | 'enemy' | null;
}
