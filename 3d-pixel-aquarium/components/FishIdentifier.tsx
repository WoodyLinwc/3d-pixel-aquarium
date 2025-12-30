import React, { useState } from "react";

interface FishIdentifierProps {
  fishList: string[]; // Array of fish sprite paths currently in the tank
  isMobile?: boolean; // Detect if on mobile device
}

// Fish name translations (English to Chinese)
const FISH_TRANSLATIONS: Record<string, string> = {
  // Ocean Fish
  Angelfish: "神仙鱼",
  Anglerfish: "琵琶鱼",
  "Atlantic Bass": "大西洋鲈鱼",
  "Ballan Wrasse": "贝氏隆头鱼",
  "Banded Butterflyfish": "纹带蝴蝶鱼",
  "Black Drum": "黑鼓鱼",
  "Blob Fish": "水滴鱼",
  "Blue Tang": "蓝吊鱼",
  Bonefish: "北梭鱼",
  Bream: "鲷鱼",
  Clownfish: "小丑鱼",
  Cobia: "军曹鱼",
  Cod: "鳕鱼",
  Cowfish: "角箱鲀",
  Dab: "黄盖鲽",
  Flounder: "比目鱼",
  Hailbut: "大比目鱼",
  Herring: "鲱鱼",
  "Lion Fish": "狮子鱼",
  Mackerel: "鲭鱼",
  "Parrot Fish": "鹦鹉鱼",
  Plaice: "鲽鱼",
  Pollock: "鳕鱼",
  Pompano: "鲳鲹",
  Pufferfish: "河豚",
  "Red Snapper": "红鲷鱼",
  Salmon: "三文鱼",
  Sardine: "沙丁鱼",
  "Sea Horse": "海马",
  "Silver Eel": "银鳗",
  Stingray: "黄貂鱼",
  Tuna: "金枪鱼",
  Weaver: "鲈形目鱼",
  Whiting: "牙鳕",
  Wolfish: "狼鱼",

  // Ocean Creatures
  "Blue Lobster": "蓝龙虾",
  "Christmas Tree Worm": "大旋鳃虫",
  Crab: "螃蟹",
  "Dumbo Octopus": "小飞象章鱼",
  Jellyfish: "水母",
  Lobster: "龙虾",
  Octopus: "章鱼",
  "Pink Fantasia": "梦海鼠",
  "Saltwater Snail": "海螺",
  "Sea Angel": "裸海蝶",
  "Sea Cucumber": "海参",
  "Sea Pen": "海笔",
  "Sea Spider": "海蜘蛛",
  "Sea Urchin": "海胆",
  Shrimp: "虾",
  Squid: "鱿鱼",
  Turtle: "海龟",

  // River Fish
  Betta: "斗鱼",
  Bitterling: "鳑鲏",
  "Black Bass": "黑鲈",
  Bluegill: "蓝鳃太阳鱼",
  Catfish: "鲶鱼",
  Char: "红点鲑",
  Chub: "鲴鱼",
  Crappie: "刺盖太阳鱼",
  "Crucian Carp": "鲫鱼",
  Dace: "雅罗鱼",
  Eel: "鳗鱼",
  Guppy: "孔雀鱼",
  "King Salmon": "帝王鲑",
  "Largemouth Bass": "大口黑鲈",
  Loadch: "泥鳅",
  "Neon Tetra": "霓虹灯鱼",
  Perch: "鲈鱼",
  Piranha: "食人鱼",
  "Rainbow Trout": "虹鳟",
  Smelt: "胡瓜鱼",
  Tilapia: "罗非鱼",
  Trout: "鳟鱼",
  Walleye: "大眼鲈",
  "Yellow Perch": "黄鲈",

  // Pond Fish
  "Fancy Goldfish": "金鱼",
  "Fathead Minnow": "黑头呆鱼（胖头鱥）",
  "Gizzard Shad": "西鲱",
  Goby: "虾虎鱼",
  "Golden Tench": "金色丁鱥",
  Goldfish: "金鱼",
  "Grass Carp": "草鱼",
  "Green Sunfish": "绿太阳鱼",
  "High Fin Banded Shark": "高鳍板鲨",
  Koi: "锦鲤",
  Molly: "茉莉花鳉",
  "Paradise Fish": "天堂鱼（盖斑斗鱼）",
  Plecostomus: "清道夫鱼",
  "Pumpkin Seed Fish": "南瓜籽太阳鱼",
  "Red Shiner": "红鳍鲌",
  Rosette: "玫瑰鱼",
  Shubukin: "朱文锦",

  // River Pond Creatures
  Axolotl: "六角恐龙（墨西哥钝口螈）",
  Crayfish: "小龙虾",
  "Freshwater Snail": "淡水螺",
  Frog: "青蛙",
  Snake: "蛇",
  Tadpole: "蝌蚪",
  "Water Beetle": "水甲虫",

  // Custom Fish (Easter Egg!)
  "fish 1": "神秘鱼1",
  "fish 2": "神秘鱼2",
  "fish 3": "神秘鱼3",
};

export const FishIdentifier: React.FC<FishIdentifierProps> = ({
  fishList,
  isMobile = false,
}) => {
  const [isOpen, setIsOpen] = useState(!isMobile); // Open by default on desktop, closed on mobile
  const [viewMode, setViewMode] = useState<"tank" | "codex">("tank"); // Toggle between tank view and codex view

  // Extract fish names from sprite paths
  const getFishInfo = (spritePath: string) => {
    // Extract filename from path like "/fish/OceanFish/Clownfish.png"
    const parts = spritePath.split("/");
    const filename = parts[parts.length - 1].replace(".png", "");
    const category = parts[parts.length - 2];

    // Convert filename to readable name (e.g., "Fancy_Goldfish" -> "Fancy Goldfish")
    const name = filename.replace(/_/g, " ");
    const chineseName = FISH_TRANSLATIONS[name] || name;

    return { name, chineseName, category, spritePath };
  };

  // Get unique fish (remove duplicates)
  const uniqueFish = Array.from(new Set(fishList)).map(getFishInfo);

  // Group by category
  const groupedFish = uniqueFish.reduce((acc, fish) => {
    if (!acc[fish.category]) {
      acc[fish.category] = [];
    }
    acc[fish.category].push(fish);
    return acc;
  }, {} as Record<string, typeof uniqueFish>);

  // Get all available fish for codex
  const getAllAvailableFish = () => {
    const allCategories = {
      OceanFish: [
        "Angelfish",
        "Anglerfish",
        "Atlantic Bass",
        "Ballan Wrasse",
        "Banded Butterflyfish",
        "Black Drum",
        "Blob Fish",
        "Blue Tang",
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
        "Lion Fish",
        "Mackerel",
        "Parrot Fish",
        "Plaice",
        "Pollock",
        "Pompano",
        "Pufferfish",
        "Red Snapper",
        "Salmon",
        "Sardine",
        "Sea Horse",
        "Silver Eel",
        "Stingray",
        "Tuna",
        "Weaver",
        "Whiting",
        "Wolfish",
      ],
      OceanCreatures: [
        "Blue Lobster",
        "Christmas Tree Worm",
        "Crab",
        "Dumbo Octopus",
        "Jellyfish",
        "Lobster",
        "Octopus",
        "Pink Fantasia",
        "Saltwater Snail",
        "Sea Angel",
        "Sea Cucumber",
        "Sea Pen",
        "Sea Spider",
        "Sea Urchin",
        "Shrimp",
        "Squid",
        "Turtle",
      ],
      RiverFish: [
        "Betta",
        "Bitterling",
        "Black Bass",
        "Bluegill",
        "Catfish",
        "Char",
        "Chub",
        "Crappie",
        "Crucian Carp",
        "Dace",
        "Eel",
        "Guppy",
        "King Salmon",
        "Largemouth Bass",
        "Loadch",
        "Neon Tetra",
        "Perch",
        "Piranha",
        "Rainbow Trout",
        "Smelt",
        "Tilapia",
        "Trout",
        "Walleye",
        "Yellow Perch",
      ],
      PondFish: [
        "Fancy Goldfish",
        "Fathead Minnow",
        "Gizzard Shad",
        "Goby",
        "Golden Tench",
        "Goldfish",
        "Grass Carp",
        "Green Sunfish",
        "High Fin Banded Shark",
        "Koi",
        "Molly",
        "Paradise Fish",
        "Plecostomus",
        "Pumpkin Seed Fish",
        "Red Shiner",
        "Rosette",
        "Shubukin",
      ],
      RiverPondCreatures: [
        "Axolotl",
        "Crayfish",
        "Freshwater Snail",
        "Frog",
        "Snake",
        "Tadpole",
        "Water Beetle",
      ],
      RealFish: ["fish 1", "fish 2", "fish 3"],
    };

    const allFish: ReturnType<typeof getFishInfo>[] = [];
    Object.entries(allCategories).forEach(([category, names]) => {
      names.forEach((name) => {
        const spritePath = `/fish/${category}/${name.replace(/ /g, "_")}.png`;
        allFish.push(getFishInfo(spritePath));
      });
    });

    return allFish;
  };

  const allAvailableFish = getAllAvailableFish();

  // Group all available fish by category
  const allGroupedFish = allAvailableFish.reduce((acc, fish) => {
    if (!acc[fish.category]) {
      acc[fish.category] = [];
    }
    acc[fish.category].push(fish);
    return acc;
  }, {} as Record<string, typeof allAvailableFish>);

  // Check if a fish is currently in the tank
  const isInTank = (fishName: string) => {
    return uniqueFish.some((f) => f.name === fishName);
  };

  // Handle fish click - Easter egg for custom fish!
  const handleFishClick = (fish: ReturnType<typeof getFishInfo>) => {
    // Check if it's a custom fish (fish_1, fish_2, or fish_3)
    if (
      fish.category === "RealFish" &&
      ["fish 1", "fish 2", "fish 3"].includes(fish.name)
    ) {
      // Rick Roll easter egg!
      window.open("https://www.youtube.com/watch?v=dQw4w9WgXcQ", "_blank");
    } else {
      // Normal behavior: Google Image search
      // For creatures that aren't fish, don't add " fish" suffix
      const isCreature = fish.category.includes("Creatures");
      const searchQuery = isCreature
        ? encodeURIComponent(fish.name)
        : encodeURIComponent(fish.name + " fish");
      window.open(
        `https://www.google.com/search?tbm=isch&q=${searchQuery}`,
        "_blank"
      );
    }
  };

  // Render fish card
  const renderFishCard = (
    fish: ReturnType<typeof getFishInfo>,
    idx: number,
    isCodex: boolean = false
  ) => {
    const inTank = isInTank(fish.name);
    return (
      <button
        key={idx}
        onClick={() => handleFishClick(fish)}
        className={`border-2 p-2 flex flex-col items-center hover:bg-slate-700 active:translate-y-0.5 transition-all cursor-pointer ${
          isCodex
            ? inTank
              ? "bg-cyan-900 border-cyan-500" // In tank - highlight
              : "bg-slate-800 border-slate-600 opacity-60" // Not in tank - dim
            : "bg-slate-800 border-slate-600 hover:border-cyan-400" // Tank view - normal
        }`}
        style={{ boxShadow: "2px 2px 0 rgba(0,0,0,0.3)" }}
      >
        <img
          src={fish.spritePath}
          alt={fish.name}
          className="w-16 h-16 object-contain mb-1 pointer-events-none"
          style={{ imageRendering: "pixelated" }}
        />
        <span
          className={`text-[10px] text-center leading-tight pointer-events-none ${
            isCodex && inTank ? "text-cyan-300 font-bold" : "text-white"
          }`}
          style={{ fontFamily: "monospace" }}
        >
          {fish.name}
        </span>
        <span
          className={`text-[9px] text-center leading-tight mt-0.5 pointer-events-none ${
            isCodex && inTank ? "text-cyan-200" : "text-cyan-300"
          }`}
          style={{ fontFamily: "sans-serif" }}
        >
          {fish.chineseName}
        </span>
        {isCodex && inTank && (
          <span
            className="text-[8px] text-cyan-400 font-bold mt-1 pointer-events-none"
            style={{ fontFamily: "monospace" }}
          >
            ✓ IN TANK
          </span>
        )}
      </button>
    );
  };

  const dataToDisplay = viewMode === "tank" ? groupedFish : allGroupedFish;
  const totalCount =
    viewMode === "tank" ? uniqueFish.length : allAvailableFish.length;

  return (
    <div className="fixed bottom-6 left-6 pointer-events-auto z-50">
      {/* Toggle Button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="bg-slate-800 border-4 border-slate-600 px-4 py-3 hover:bg-slate-700 active:translate-y-1 transition-transform font-black text-sm text-white tracking-widest"
        style={{
          boxShadow: "4px 4px 0 rgba(0,0,0,0.5)",
          fontFamily: "monospace",
        }}
      >
        {isOpen ? "✕ CLOSE" : "🐠 FISH ID"}
      </button>

      {/* Fish Panel */}
      {isOpen && (
        <div
          className="absolute bottom-16 left-0 bg-slate-900/95 border-4 border-slate-600 p-4 max-h-[500px] overflow-y-auto"
          style={{
            boxShadow: "4px 4px 0 rgba(0,0,0,0.5)",
            width: "320px",
          }}
        >
          {/* Header with View Toggle */}
          <div className="mb-3">
            <h3
              className="text-yellow-400 font-black text-sm tracking-widest text-center border-b-2 border-slate-600 pb-2 mb-2"
              style={{ fontFamily: "monospace" }}
            >
              {viewMode === "tank" ? "SPECIES IN TANK" : "FISH CODEX"}
            </h3>

            {/* View Mode Buttons */}
            <div className="flex gap-2">
              <button
                onClick={() => setViewMode("tank")}
                className={`flex-1 h-10 border-2 transition-all font-bold text-xs tracking-wide ${
                  viewMode === "tank"
                    ? "bg-cyan-700 border-cyan-500 text-white"
                    : "bg-slate-800 border-slate-600 text-slate-400 hover:bg-slate-700"
                }`}
                style={{
                  boxShadow: "2px 2px 0 rgba(0,0,0,0.3)",
                  fontFamily: "monospace",
                }}
              >
                🐠 TANK VIEW
              </button>
              <button
                onClick={() => setViewMode("codex")}
                className={`flex-1 h-10 border-2 transition-all font-bold text-xs tracking-wide ${
                  viewMode === "codex"
                    ? "bg-purple-700 border-purple-500 text-white"
                    : "bg-slate-800 border-slate-600 text-slate-400 hover:bg-slate-700"
                }`}
                style={{
                  boxShadow: "2px 2px 0 rgba(0,0,0,0.3)",
                  fontFamily: "monospace",
                }}
              >
                📖 CODEX
              </button>
            </div>

            {/* Description */}
            {viewMode === "codex" && (
              <p
                className="text-slate-400 text-[9px] text-center mt-2 leading-tight"
                style={{ fontFamily: "monospace" }}
              >
                Highlighted fish are currently in your tank
              </p>
            )}
          </div>

          {Object.entries(dataToDisplay).map(([category, fishes]) => (
            <div key={category} className="mb-4">
              <h4
                className="text-cyan-400 font-bold text-xs tracking-wide mb-2"
                style={{ fontFamily: "monospace" }}
              >
                {category
                  .replace(/([A-Z])/g, " $1")
                  .trim()
                  .toUpperCase()}
              </h4>

              <div className="grid grid-cols-2 gap-2">
                {fishes.map((fish, idx) =>
                  renderFishCard(fish, idx, viewMode === "codex")
                )}
              </div>
            </div>
          ))}

          <div
            className="mt-3 pt-3 border-t-2 border-slate-600 text-slate-400 text-[9px] text-center"
            style={{ fontFamily: "monospace" }}
          >
            {viewMode === "tank"
              ? `Total Species: ${totalCount}`
              : `Total Available: ${totalCount} | In Tank: ${uniqueFish.length}`}
          </div>
        </div>
      )}
    </div>
  );
};
