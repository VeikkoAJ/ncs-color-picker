import { useState, useEffect, useCallback } from "react";
import {
  getColor,
  getColorCode,
  getColorGrid,
  getSurroundingHues,
} from "../colors";
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

  const { chromatinesValues, grid } = getColorGrid(hue);

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
        <div className="grid grid-cols-9 gap-2">
          {getSurroundingHues(hue).map((h) => {
            const c = getColor({ hue: h, chromatines: "40", blackness: "40" });
            return (
              <ColorButton
                key={h}
                color={c?.[1]}
                onClick={() => updateColor({ hue: h })}
                isSelected={hue === h}
              />
            );
          })}
        </div>

        <div
          className="grid gap-1"
          style={{
            gridTemplateColumns: `repeat(${chromatinesValues.length}, 2.5rem)`,
          }}
        >
          {grid.map((row, ri) =>
            row.map((cell, ci) => (
              <ColorButton
                key={`${ri}-${ci}`}
                color={cell}
                compact
                onClick={() => {
                  if (!cell) return;
                  updateColor({
                    blackness: cell.blackness,
                    chromatines: cell.chromatines,
                  });
                }}
                isSelected={
                  cell?.blackness === blackness &&
                  cell?.chromatines === chromatines
                }
              />
            ))
          )}
        </div>
      </div>
    </main>
  );
}
