import { useState, useEffect, useCallback } from "react";
import {
  getColor,
  getColorCode,
  getSurroundingColors,
  getSurroundingHues,
} from "../colors";
import { ncsHuesHex } from "@/colors/ncsValues";
import { ColorButton } from "@/components/ColorButton";

function useSearchParams() {
  const [params, setParams] = useState(
    () => new URLSearchParams(window.location.search)
  );

  useEffect(() => {
    const handler = () =>
      setParams(new URLSearchParams(window.location.search));
    window.addEventListener("popstate", handler);
    return () => window.removeEventListener("popstate", handler);
  }, []);

  const push = useCallback((search: string) => {
    window.history.pushState(null, "", search);
    setParams(new URLSearchParams(window.location.search));
  }, []);

  return { params, push };
}

export function ColorPicker() {
  const { params, push } = useSearchParams();

  const hue = params.get("hue") ?? "N";
  const chromatines = params.get("chromatines") ?? "40";
  const blackness = params.get("blackness") ?? "40";
  const whiteBg = params.get("whiteBg") === "1";

  const updateColor = useCallback(
    (updates: {
      hue?: string;
      chromatines?: string;
      blackness?: string;
      whiteBg?: boolean;
    }) => {
      const next = new URLSearchParams(params.toString());
      if (updates.hue !== undefined) next.set("hue", updates.hue);
      if (updates.chromatines !== undefined)
        next.set("chromatines", updates.chromatines);
      if (updates.blackness !== undefined)
        next.set("blackness", updates.blackness);
      if (updates.whiteBg !== undefined) {
        if (updates.whiteBg) next.set("whiteBg", "1");
        else next.delete("whiteBg");
      }
      push(`?${next.toString()}`);
    },
    [params, push]
  );

  const color = getColor({ hue, chromatines, blackness });
  const colors = getSurroundingColors({ hue, chromatines, blackness });

  return (
    <main
      className={`flex min-h-screen flex-col items-center p-24 gap-5 ${whiteBg ? "bg-white" : ""}`}
    >
      <button
        className="text-sm rounded bg-slate-400 p-1 self-end"
        onClick={() => updateColor({ whiteBg: !whiteBg })}
      >
        {whiteBg ? "default background" : "white background"}
      </button>
      <h1 className="text-3xl">
        {getColorCode({ hue, chromatines, blackness })}
      </h1>

      <div className="flex flex-col gap-4 items-center font-mono">
        <div className="flex flex-row gap-4 items-center">
          <span>Hue: {hue}</span>
          <button
            className="text-sm text-center rounded bg-slate-400 p-1"
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
              onClick={() => updateColor({ hue: h })}
              isSelected={hue === h}
            />
          ))}
        </div>
        <div className="text-base flex flex-row gap-4 items-center">
          <span>Blackness: {blackness}</span>
          <span>Chromatines: {chromatines}</span>
          <button
            className="text-sm text-center rounded bg-slate-400 p-1"
            onClick={() => updateColor({ chromatines: "40", blackness: "40" })}
          >
            reset
          </button>
        </div>
        <div className={`grid grid-cols-3 gap-4 bg-[${"#50d71e"}]`}>
          <div className="col-start-2">
            <ColorButton
              color={colors.previousBlackness}
              onClick={() =>
                updateColor({ blackness: colors.previousBlackness.blackness })
              }
              isSelected={false}
            />
          </div>
          <div className="row-start-2">
            <ColorButton
              color={colors.previousChromatines}
              onClick={() =>
                updateColor({
                  chromatines: colors.previousChromatines.chromatines,
                })
              }
              isSelected={false}
            />
          </div>
          <div className="row-start-2 col-start-2">
            <ColorButton
              color={color?.[1]}
              onClick={() => {
                if (!color) return;
                updateColor({
                  chromatines: color[1].chromatines,
                  blackness: color[1].blackness,
                });
              }}
              isSelected={true}
            />
          </div>
          <div className="row-start-2 col-start-3">
            <ColorButton
              color={colors.nextChromatines}
              onClick={() =>
                updateColor({
                  chromatines: colors.nextChromatines.chromatines,
                })
              }
              isSelected={false}
            />
          </div>
          <div className="row-start-3 col-start-2">
            <ColorButton
              color={colors.nextBlackness}
              onClick={() =>
                updateColor({ blackness: colors.nextBlackness.blackness })
              }
              isSelected={false}
            />
          </div>
        </div>
      </div>
    </main>
  );
}
