import { ncsHuesHex, ncsHues, ncsColors, NcsColor } from "./ncsValues";

export const getHex = (hue: string) => ncsHuesHex[hue] ?? "#ffffff";

export const getSurroundingHues = (hue: string) => {
  const index = ncsHues.indexOf(hue) ?? 0;

  const previousHues = [];
  const nextHues = [];

  const length = ncsHues.length;

  for (let i = -4; i < 0; i++) {
    previousHues.push(ncsHues[(index + i + length) % length]);
  }
  for (let i = 1; i <= 4; i++) {
    nextHues.push(ncsHues[(index + i) % length]);
  }

  return [...previousHues, hue, ...nextHues];
};

export const getColor = ({
  hue,
  chromatines,
  blackness,
}: {
  hue: string;
  chromatines: string;
  blackness: string;
}) =>
  Object.entries(ncsColors).find(
    ([_, val]) =>
      val.hue === hue &&
      val.chromatines === chromatines &&
      val.blackness === blackness,
  );

export const getSurroundingColors = ({
  hue,
  chromatines,
  blackness,
}: Omit<NcsColor, "hex">) => {
  const colorArray = Object.values(ncsColors);

  const sameBlackness = colorArray
    .filter((color) => color.hue === hue && color.blackness === blackness)
    .sort((a, b) => Number(a.chromatines) - Number(b.chromatines));
  const blacknessIndex = sameBlackness.findIndex(
    (color) => color.chromatines === chromatines,
  );

  const sameChromatines = colorArray
    .filter((color) => color.hue === hue && color.chromatines === chromatines)
    .sort((a, b) => Number(a.blackness) - Number(b.blackness));
  const chromatinesIndex = sameChromatines.findIndex(
    (color) => color.blackness === blackness,
  );

  return {
    previousBlackness: sameChromatines[chromatinesIndex - 1],
    nextBlackness: sameChromatines[chromatinesIndex + 1],
    previousChromatines: sameBlackness[blacknessIndex - 1],
    nextChromatines: sameBlackness[blacknessIndex + 1],
  };
};

export const getColorCode = (color: Omit<NcsColor, "hex">) =>
  `S ${color.blackness}${color.chromatines}-${color.hue}`;

export const getColorFromCode = (color: string) => ncsColors[color];
