enum GameMode {
  AlphaTerrain = 0,
  FlatTerrain = 1,
  ClassicTerrain = 2,
  CreatedTerrain_Test = 3,
  CreatedTerrain = 4,
  Challenge = 5,
  ChallengeBuilder = 6,
  Terrain = 7,
  MenuCreation = 8,
  Survival = 14,
  Custom = 15,
  Development = 16,
}

export enum GameModeDescriptions {
  AlphaTerrain = "Creative mode with terrain up to 0.2.14",
  FlatTerrain = "Creative mode with flat terrain",
  ClassicTerrain = "Creative mode with terrain from 0.3.0 to 0.4.8",
  CreatedTerrain_Test = "Creative mode with World Builder terrain in 0.2.12_Test",
  CreatedTerrain = "Creative mode with World Builder terrain",
  Challenge = "Challenge mode (play/test)",
  ChallengeBuilder = "Challenge mode (build)",
  Terrain = "Creative mode with terrain starting from 0.5.0",
  MenuCreation = "Main menu creation editor",
  Survival = "Survival mode",
  Custom = "Custom game mode (Steam Workshop)",
  Development = "Axolot Games development game mode",
}

export default GameMode;
