
import React, { createContext, useContext, useReducer, ReactNode } from 'react';

interface Employee {
  id?: string;
  name: string;
  code: string;
  email: string;
  city: string;
  zone: string;
}

interface ScenarioResponse {
  scenarioId: number;
  hypothesis: string;
  toolsUsed: string[];
  timeSpent: number;
  score: number;
}

interface GameState {
  gameId: string;
  employee: Employee | null;
  employeeId: string | null;
  gameSessionId: string | null;
  currentScenario: number;
  responses: ScenarioResponse[];
  totalScore: number;
  startTime: number;
}

type GameAction = 
  | { type: 'SET_EMPLOYEE'; payload: { employee: Employee; employeeId: string } }
  | { type: 'SET_GAME_SESSION'; payload: string }
  | { type: 'SET_SCENARIO'; payload: number }
  | { type: 'ADD_RESPONSE'; payload: ScenarioResponse }
  | { type: 'CALCULATE_TOTAL_SCORE' }
  | { type: 'RESET_GAME' };

const initialState: GameState = {
  gameId: Date.now().toString(),
  employee: null,
  employeeId: null,
  gameSessionId: null,
  currentScenario: 1,
  responses: [],
  totalScore: 0,
  startTime: Date.now(),
};

const gameReducer = (state: GameState, action: GameAction): GameState => {
  switch (action.type) {
    case 'SET_EMPLOYEE':
      return { 
        ...state, 
        employee: action.payload.employee,
        employeeId: action.payload.employeeId
      };
    case 'SET_GAME_SESSION':
      return { ...state, gameSessionId: action.payload };
    case 'SET_SCENARIO':
      return { ...state, currentScenario: action.payload };
    case 'ADD_RESPONSE':
      return { ...state, responses: [...state.responses, action.payload] };
    case 'CALCULATE_TOTAL_SCORE':
      return { 
        ...state, 
        totalScore: state.responses.reduce((total, response) => total + response.score, 0)
      };
    case 'RESET_GAME':
      return { ...initialState, gameId: Date.now().toString() };
    default:
      return state;
  }
};

const GameContext = createContext<{
  state: GameState;
  dispatch: React.Dispatch<GameAction>;
} | null>(null);

export const GameProvider = ({ children }: { children: ReactNode }) => {
  const [state, dispatch] = useReducer(gameReducer, initialState);
  
  return (
    <GameContext.Provider value={{ state, dispatch }}>
      {children}
    </GameContext.Provider>
  );
};

export const useGame = () => {
  const context = useContext(GameContext);
  if (!context) {
    throw new Error('useGame must be used within a GameProvider');
  }
  return context;
};
