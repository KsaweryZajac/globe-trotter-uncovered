
import axios from 'axios';
import { Country } from './api';

// Define types for the multiplayer API
export interface Player {
  id: string;
  name: string;
  score: number;
  avatar: string;
  isHost: boolean;
}

export interface Lobby {
  code: string;
  players: Player[];
  started: boolean;
  currentQuestion: number;
  quizSettings: {
    questionsCount: number;
    optionsPerQuestion: number;
    timeLimit: number;
  };
}

export interface LobbyJoinResponse {
  success: boolean;
  lobby: Lobby;
  playerId: string;
  message?: string;
}

export interface AnswerSubmission {
  lobbyCode: string;
  playerId: string;
  questionIndex: number;
  selectedCountryId: string;
  timeElapsed: number;
}

export interface GameState {
  lobby: Lobby;
  countries: Country[];
  currentQuestion: number;
  playersAnswered: string[];
}

// Base URL for the multiplayer API - would be replaced with a real backend URL
// For now, we'll use a mock API that simulates backend behavior
const API_BASE_URL = 'https://api.example.com/flag-quiz';

// In a real implementation, this would be actual API calls
// For now, we'll simulate the backend with local storage and timeouts
// to demonstrate the integration pattern

// Create a class to manage the local storage mock backend
class LocalStorageMockBackend {
  private static STORAGE_KEY = 'flag_quiz_lobbies';
  
  // Get all lobbies from local storage
  static getLobbies(): Record<string, Lobby> {
    const lobbiesJson = localStorage.getItem(this.STORAGE_KEY);
    return lobbiesJson ? JSON.parse(lobbiesJson) : {};
  }
  
  // Save lobbies to local storage
  static saveLobbies(lobbies: Record<string, Lobby>): void {
    localStorage.setItem(this.STORAGE_KEY, JSON.stringify(lobbies));
  }
  
  // Get a specific lobby
  static getLobby(code: string): Lobby | null {
    const lobbies = this.getLobbies();
    return lobbies[code] || null;
  }
  
  // Save or update a lobby
  static saveLobby(lobby: Lobby): void {
    const lobbies = this.getLobbies();
    lobbies[lobby.code] = lobby;
    this.saveLobbies(lobbies);
  }
}

// Generate a random lobby code
const generateLobbyCode = (): string => {
  const characters = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789'; // Removed similar-looking characters
  let result = '';
  for (let i = 0; i < 5; i++) {
    result += characters.charAt(Math.floor(Math.random() * characters.length));
  }
  return result;
};

// Generate a unique player ID
const generatePlayerId = (): string => {
  return `player_${Date.now()}_${Math.floor(Math.random() * 1000)}`;
};

// Flag Quiz Multiplayer API
const flagQuizApi = {
  // Create a new lobby
  createLobby: async (playerName: string): Promise<LobbyJoinResponse> => {
    try {
      // In a real implementation, this would be an API call
      // For now, we'll simulate it
      const lobbyCode = generateLobbyCode();
      const playerId = generatePlayerId();
      
      const newLobby: Lobby = {
        code: lobbyCode,
        players: [{
          id: playerId,
          name: playerName,
          score: 0,
          avatar: '👑', // Host gets a crown
          isHost: true
        }],
        started: false,
        currentQuestion: 0,
        quizSettings: {
          questionsCount: 10,
          optionsPerQuestion: 4,
          timeLimit: 120
        }
      };
      
      // Save the lobby to our mock backend
      LocalStorageMockBackend.saveLobby(newLobby);
      
      return {
        success: true,
        lobby: newLobby,
        playerId: playerId
      };
    } catch (error) {
      console.error('Error creating lobby:', error);
      return {
        success: false,
        lobby: {} as Lobby,
        playerId: '',
        message: 'Failed to create lobby'
      };
    }
  },
  
  // Join an existing lobby
  joinLobby: async (lobbyCode: string, playerName: string): Promise<LobbyJoinResponse> => {
    try {
      // In a real implementation, this would be an API call
      // For now, we'll simulate it
      const lobby = LocalStorageMockBackend.getLobby(lobbyCode);
      
      if (!lobby) {
        return {
          success: false,
          lobby: {} as Lobby,
          playerId: '',
          message: 'Lobby not found'
        };
      }
      
      if (lobby.started) {
        return {
          success: false,
          lobby: {} as Lobby,
          playerId: '',
          message: 'Game already started'
        };
      }
      
      const playerId = generatePlayerId();
      
      // Add the player to the lobby
      lobby.players.push({
        id: playerId,
        name: playerName,
        score: 0,
        avatar: '🧑',
        isHost: false
      });
      
      // Save the updated lobby
      LocalStorageMockBackend.saveLobby(lobby);
      
      return {
        success: true,
        lobby,
        playerId
      };
    } catch (error) {
      console.error('Error joining lobby:', error);
      return {
        success: false,
        lobby: {} as Lobby,
        playerId: '',
        message: 'Failed to join lobby'
      };
    }
  },
  
  // Start the game
  startGame: async (lobbyCode: string, playerId: string, countries: Country[]): Promise<GameState | null> => {
    try {
      // In a real implementation, this would be an API call
      // For now, we'll simulate it
      const lobby = LocalStorageMockBackend.getLobby(lobbyCode);
      
      if (!lobby) {
        return null;
      }
      
      // Check if the player is the host
      const player = lobby.players.find(p => p.id === playerId);
      if (!player || !player.isHost) {
        return null;
      }
      
      // Mark the game as started
      lobby.started = true;
      lobby.currentQuestion = 0;
      
      // Save the updated lobby
      LocalStorageMockBackend.saveLobby(lobby);
      
      // In a real implementation, the backend would select countries
      // For now, we'll just pass them from the client
      
      return {
        lobby,
        countries,
        currentQuestion: 0,
        playersAnswered: []
      };
    } catch (error) {
      console.error('Error starting game:', error);
      return null;
    }
  },
  
  // Submit an answer
  submitAnswer: async (submission: AnswerSubmission, correctCountryId: string): Promise<{ success: boolean; updatedLobby: Lobby | null }> => {
    try {
      // In a real implementation, this would be an API call
      // For now, we'll simulate it
      const lobby = LocalStorageMockBackend.getLobby(submission.lobbyCode);
      
      if (!lobby) {
        return { success: false, updatedLobby: null };
      }
      
      // Find the player
      const playerIndex = lobby.players.findIndex(p => p.id === submission.playerId);
      if (playerIndex === -1) {
        return { success: false, updatedLobby: null };
      }
      
      // Check if the answer is correct
      const isCorrect = submission.selectedCountryId === correctCountryId;
      
      // Update player score if correct
      if (isCorrect) {
        lobby.players[playerIndex].score += 1;
      }
      
      // Save the updated lobby
      LocalStorageMockBackend.saveLobby(lobby);
      
      return {
        success: true,
        updatedLobby: lobby
      };
    } catch (error) {
      console.error('Error submitting answer:', error);
      return { success: false, updatedLobby: null };
    }
  },
  
  // Get lobby state
  getLobbyState: async (lobbyCode: string): Promise<Lobby | null> => {
    try {
      // In a real implementation, this would be an API call
      // For now, we'll simulate it
      return LocalStorageMockBackend.getLobby(lobbyCode);
    } catch (error) {
      console.error('Error getting lobby state:', error);
      return null;
    }
  },
  
  // End the game and calculate final results
  endGame: async (lobbyCode: string): Promise<Lobby | null> => {
    try {
      // In a real implementation, this would be an API call
      // For now, we'll simulate it
      const lobby = LocalStorageMockBackend.getLobby(lobbyCode);
      
      if (!lobby) {
        return null;
      }
      
      // Sort players by score
      lobby.players.sort((a, b) => b.score - a.score);
      
      // Save the final state
      LocalStorageMockBackend.saveLobby(lobby);
      
      return lobby;
    } catch (error) {
      console.error('Error ending game:', error);
      return null;
    }
  },
  
  // Leave a lobby
  leaveLobby: async (lobbyCode: string, playerId: string): Promise<boolean> => {
    try {
      // In a real implementation, this would be an API call
      // For now, we'll simulate it
      const lobby = LocalStorageMockBackend.getLobby(lobbyCode);
      
      if (!lobby) {
        return false;
      }
      
      // Remove the player
      lobby.players = lobby.players.filter(p => p.id !== playerId);
      
      // If no players left, delete the lobby
      if (lobby.players.length === 0) {
        const lobbies = LocalStorageMockBackend.getLobbies();
        delete lobbies[lobbyCode];
        LocalStorageMockBackend.saveLobbies(lobbies);
        return true;
      }
      
      // If the host left, assign a new host
      if (!lobby.players.some(p => p.isHost) && lobby.players.length > 0) {
        lobby.players[0].isHost = true;
        lobby.players[0].avatar = '👑';
      }
      
      // Save the updated lobby
      LocalStorageMockBackend.saveLobby(lobby);
      
      return true;
    } catch (error) {
      console.error('Error leaving lobby:', error);
      return false;
    }
  }
};

export default flagQuizApi;
