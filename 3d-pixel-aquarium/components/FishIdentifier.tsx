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
};

export const FishIdentifier: React.FC<FishIdentifierProps> = ({
  fishList,
  isMobile = false,
}) => {
  const [isOpen, setIsOpen] = useState(!isMobile); // Open by default on desktop, closed on mobile

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

  return (
    <div className="fixed bottom-20 left-6 pointer-events-auto z-50">
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
          className="absolute bottom-16 left-0 bg-slate-900/95 border-4 border-slate-600 p-4 max-h-96 overflow-y-auto"
          style={{
            boxShadow: "4px 4px 0 rgba(0,0,0,0.5)",
            width: "320px",
          }}
        >
          <h3
            className="text-yellow-400 font-black text-sm tracking-widest mb-3 text-center border-b-2 border-slate-600 pb-2"
            style={{ fontFamily: "monospace" }}
          >
            SPECIES IN TANK
          </h3>

          {Object.entries(groupedFish).map(([category, fishes]) => (
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
                {fishes.map((fish, idx) => (
                  <button
                    key={idx}
                    onClick={() => {
                      const searchQuery = encodeURIComponent(
                        fish.name + " fish"
                      );
                      window.open(
                        `https://www.google.com/search?tbm=isch&q=${searchQuery}`,
                        "_blank"
                      );
                    }}
                    className="bg-slate-800 border-2 border-slate-600 p-2 flex flex-col items-center hover:bg-slate-700 hover:border-cyan-400 active:translate-y-0.5 transition-all cursor-pointer"
                    style={{ boxShadow: "2px 2px 0 rgba(0,0,0,0.3)" }}
                  >
                    <img
                      src={fish.spritePath}
                      alt={fish.name}
                      className="w-16 h-16 object-contain mb-1 pointer-events-none"
                      style={{ imageRendering: "pixelated" }}
                    />
                    <span
                      className="text-white text-[10px] text-center leading-tight pointer-events-none"
                      style={{ fontFamily: "monospace" }}
                    >
                      {fish.name}
                    </span>
                    <span
                      className="text-cyan-300 text-[9px] text-center leading-tight mt-0.5 pointer-events-none"
                      style={{ fontFamily: "sans-serif" }}
                    >
                      {fish.chineseName}
                    </span>
                  </button>
                ))}
              </div>
            </div>
          ))}

          <div
            className="mt-3 pt-3 border-t-2 border-slate-600 text-slate-400 text-[9px] text-center"
            style={{ fontFamily: "monospace" }}
          >
            Total Species: {uniqueFish.length}
          </div>
        </div>
      )}
    </div>
  );
};
