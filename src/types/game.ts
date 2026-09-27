export interface InventoryItem {
  id: string;
  name: string;
  description: string;
  icon?: string;
}

export interface ClueItem {
  id: string;
  title: string;
  description: string;
  discoveredAt: string;
  category: 'alcantarilla' | 'pergamino' | 'testimonio' | 'objeto';
}

export interface GameState {
  playerName: string;
  femaleName: string;
  maleName: string;
  money: number;
  parchment1: boolean;
  parchment2: boolean;
  parchment3: boolean;
  talkedToOldMan: boolean;
  sneakedBack: boolean;
  sneakedStore: boolean;
  solvedRiver: boolean;
  inventory: InventoryItem[];
  currentNodeId: string;
  visitedNodes: string[];
  audioMuted: boolean;
}

export interface Choice {
  id: string;
  text: string;
  targetNodeId?: string;
  action?: (state: GameState) => Partial<GameState> | void;
  condition?: (state: GameState) => boolean;
  disabledReason?: string;
}

export type SceneType = 'standard' | 'input' | 'cutscene' | 'riddle' | 'river_puzzle';

export interface StoryNode {
  id: string;
  title: string;
  location?: string;
  speaker?: {
    name: string;
    avatar?: string;
    role?: string;
  };
  description: string | ((state: GameState) => string);
  image?: string;
  bgMusic?: string;     // URL o ruta dentro de /audio/...
  soundEffect?: string; // Efecto de sonido puntual /audio/...
  type?: SceneType;
  autoAdvanceMs?: number; // Para cinemáticas automáticas (ej. vídeo de entrada)
  nextAutoNodeId?: string;
  inputConfig?: {
    label: string;
    placeholder: string;
    defaultValue?: string;
    onSubmit: (value: string, state: GameState) => { nextNodeId: string; statePatch?: Partial<GameState> };
  };
  choices: Choice[];
}
