"use client";
import { useCallback } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import {
  getColor,
  getColorCode,
  getSurroundingColors,
  getSurroundingHues,
} from "../colors";
import { ncsHuesHex } from "@/colors/ncsValues";
import { ColorButton } from "@/components/ColorButton";

export function ColorPicker() {
  const router = useRouter();
  const searchParams = useSearchParams();

  const hue = searchParams.get("hue") ?? "N";
  const chromatines = searchParams.get("chromatines") ?? "40";
  const blackness = searchParams.get("blackness") ?? "40";

  const updateColor = useCallback(
    (updates: { hue?: string; chromatines?: string; blackness?: string }) => {
      const params = new URLSearchParams(searchParams.toString());
      if (updates.hue !== undefined) params.set("hue", updates.hue);
      if (updates.chromatines !== undefined) params.set("chromatines", updates.chromatines);
      if (updates.blackness !== undefined) params.set("blackness", updates.blackness);
      router.push(`?${params.toString()}`);
    },
    [router, searchParams]
  );

  const setHue = (h: string) => updateColor({ hue: h });
  const setChromatines = (c: string) => updateColor({ chromatines: c });
  const setBlackness = (b: string) => updateColor({ blackness: b });

  const whiteBg = searchParams.get("whiteBg") === "1";
  const toggleWhiteBg = () => {
    const params = new URLSearchParams(searchParams.toString());
    if (whiteBg) params.delete("whiteBg");
    else params.set("whiteBg", "1");
    router.push(`?${params.toString()}`);
  };

  const color = getColor({ hue, chromatines, blackness });

  const colors = getSurroundingColors({ hue, chromatines, blackness });

  return (
    <main className={`flex min-h-screen flex-col items-center p-24 gap-5 ${whiteBg ? "bg-white" : ""}`}>
      <button
        className="text-sm rounded bg-slate-400 p-1 self-end"
        onClick={toggleWhiteBg}
      >
        {whiteBg ? "default background" : "white background"}
      </button>
      <h1 className="text-3xl">
        {getColorCode({
          hue,
          chromatines,
          blackness,
        })}
      </h1>

      <div className="flex flex-col gap-4 items-center font-mono ">
        <div className="flex flex-row gap-4 items-center">
          <span>Hue: {hue}</span>
          <button
            className=" text-sm text-center rounded bg-slate-400 p-1"
            onClick={() => updateColor({ hue: "N" })}
          >
            reset
          </button>
        </div>
        <div className={`grid grid-cols-9 gap-4 bg-[${"#50d71e"}]`}>
          {getSurroundingHues(hue).map((h) => (
            <ColorButton
              key={h}
              color={{
                hue: h,
                chromatines: "40",
                blackness: "40",
                hex: ncsHuesHex[h],
              }}
              onClick={() => setHue(h)}
              isSelected={hue === h}
            />
          ))}
        </div>
        <div className="text-base flex flex-row gap-4 items-center">
          <span>Blackness: {blackness}</span>
          <span>Chromatines: {chromatines}</span>
          <button
            className=" text-sm text-center rounded bg-slate-400 p-1"
            onClick={() => updateColor({ chromatines: "40", blackness: "40" })}
          >
            reset
          </button>
        </div>
        <div className={`grid grid-cols-3 gap-4 bg-[${"#50d71e"}]`}>
          <div className="col-start-2">
            <ColorButton
              color={colors.previousBlackness}
              onClick={() => setBlackness(colors.previousBlackness.blackness)}
              isSelected={false}
            />
          </div>
          <div className="row-start-2">
            <ColorButton
              color={colors.previousChromatines}
              onClick={() =>
                setChromatines(colors.previousChromatines.chromatines)
              }
              isSelected={false}
            />
          </div>
          <div className="row-start-2 col-start-2">
            <ColorButton
              color={color?.[1]}
              onClick={() => {
                if (!color) return;
                setChromatines(color?.[1].chromatines);
                setBlackness(color?.[1].blackness);
              }}
              isSelected={true}
            />
          </div>
          <div className="row-start-2 col-start-3">
            <ColorButton
              color={colors.nextChromatines}
              onClick={() => setChromatines(colors.nextChromatines.chromatines)}
              isSelected={false}
            />
          </div>
          <div className="row-start-3 col-start-2">
            <ColorButton
              color={colors.nextBlackness}
              onClick={() => setBlackness(colors.nextBlackness.blackness)}
              isSelected={false}
            />
          </div>
        </div>
      </div>
    </main>
  );
}
