export const TANK_SIZE = {
  width: 6,
  height: 4,
  depth: 4,
};

// Fish organized by environment
export const POND_FISH = [
  "Fancy_Goldfish",
  "Fathead_Minnow",
  "Gizzard_Shad",
  "Goby",
  "Golden_Tench",
  "Goldfish",
  "Grass_Carp",
  "Green_Sunfish",
  "High_Fin_Banded_Shark",
  "Koi",
  "Molly",
  "Paradise_Fish",
  "Plecostomus",
  "Pumpkin_Seed_Fish",
  "Red_Shiner",
  "Rosette",
  "Shubukin",
].map((name) => `/fish/PondFish/${name}.png`);

export const RIVER_FISH = [
  "Betta",
  "Bitterling",
  "Black_Bass",
  "Bluegill",
  "Catfish",
  "Char",
  "Chub",
  "Crappie",
  "Crucian_Carp",
  "Dace",
  "Eel",
  "Guppy",
  "King_Salmon",
  "Largemouth_Bass",
  "Loadch",
  "Neon_Tetra",
  "Perch",
  "Piranha",
  "Rainbow_Trout",
  "Smelt",
  "Tilapia",
  "Trout",
  "Walleye",
  "Yellow_Perch",
].map((name) => `/fish/RiverFish/${name}.png`);

export const OCEAN_FISH = [
  "Angelfish",
  "Anglerfish",
  "Atlantic_Bass",
  "Ballan_Wrasse",
  "Banded_Butterflyfish",
  "Black_Drum",
  "Blob_Fish",
  "Blue_Tang",
  "Bonefish",
  "Bream",
  "Clownfish",
  "Cobia",
  "Cod",
  "Cowfish",
  "Dab",
  "Flounder",
  "Hailbut",
  "Herring",
  "Lion_Fish",
  "Mackerel",
  "Parrot_Fish",
  "Plaice",
  "Pollock",
  "Pompano",
  "Pufferfish",
  "Red_Snapper",
  "Salmon",
  "Sardine",
  "Sea_Horse",
  "Silver_Eel",
  "Stingray",
  "Tuna",
  "Weaver",
  "Whiting",
  "Wolfish",
].map((name) => `/fish/OceanFish/${name}.png`);

export const OCEAN_CREATURES = [
  "Blue_Lobster",
  "Chrismas_Tree_Worm",
  "Crab",
  "Dumbo_Octopus",
  "Jellyfish",
  "Lobster",
  "Octopus",
  "Pink_Fantasia",
  "Saltwater_Snail",
  "Sea_Angel",
  "Sea_Cucumber",
  "Sea_Pen",
  "Sea_Spider",
  "Sea_Urchin",
  "Shrimp",
  "Squid",
  "Turtle",
].map((name) => `/fish/OceanCreatures/${name}.png`);

export const RIVER_POND_CREATURES = [
  "Axolotl",
  "Crayfish",
  "Freshwater_Snail",
  "Frog",
  "Snake",
  "Tadpole",
  "Water_Beetle",
].map((name) => `/fish/RiverPondCreatures/${name}.png`);

// Combined lists for each environment type
export const ALL_POND = [...POND_FISH, ...RIVER_POND_CREATURES];
export const ALL_RIVER = [...RIVER_FISH, ...RIVER_POND_CREATURES];
export const ALL_OCEAN = [...OCEAN_FISH, ...OCEAN_CREATURES];
export const ALL_FISH = [
  ...POND_FISH,
  ...RIVER_FISH,
  ...OCEAN_FISH,
  ...OCEAN_CREATURES,
  ...RIVER_POND_CREATURES,
];

// Default fish sprites (for backward compatibility)
export const FISH_SPRITES = ALL_OCEAN;

// Environment types
export type Environment = "ocean" | "river" | "pond" | "all";

// Function to get fish for specific environment
export function getFishForEnvironment(environment: Environment): string[] {
  switch (environment) {
    case "ocean":
      return ALL_OCEAN;
    case "river":
      return ALL_RIVER;
    case "pond":
      return ALL_POND;
    case "all":
      return ALL_FISH;
    default:
      return ALL_OCEAN;
  }
}
