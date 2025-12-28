export const FISH_SPRITES = Array.from(
  { length: 100 },
  (_, i) => `/fish/fish_${String(i).padStart(3, "0")}.png`
);

export const TANK_SIZE = {
  width: 6,
  height: 4,
  depth: 4,
};
