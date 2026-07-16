import { Fragment, useState, useEffect, useCallback } from "react";
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

  const { blacknessValues, chromatinesValues, grid } = getColorGrid(hue);

  return (
    <main
      className={`flex min-h-screen flex-col items-center px-6 pt-4 pb-6 gap-3 ${whiteBg ? "bg-white" : ""}`}
    >
      <div className="w-full flex items-center justify-between font-mono text-sm">
        <h1 className="text-xl">{getColorCode({ hue, chromatines, blackness })}</h1>
        <button
          className="rounded bg-slate-400 p-1"
          onClick={() => updateColor({ whiteBg: !whiteBg })}
        >
          {whiteBg ? "default background" : "white background"}
        </button>
      </div>

      <div className="flex flex-col gap-3 items-center font-mono">
        <div className="flex flex-row gap-3 items-center text-sm">
          <span>Hue: {hue}</span>
          <button
            className="text-xs rounded bg-slate-400 p-1"
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

        {/* Color grid with axis labels */}
        <div className="flex gap-1 items-start">
          {/* Rotated Blackness legend */}
          <div
            className="text-xs self-center select-none"
            style={{ writingMode: "vertical-rl", transform: "rotate(180deg)" }}
          >
            Blackness ↑
          </div>

          <div className="flex flex-col gap-1">
            {/* Chromaticness legend */}
            <div className="text-xs text-center select-none pl-8">
              Chromaticness →
            </div>

            {/* Grid: corner + col headers + row labels + cells */}
            <div
              className="grid gap-1"
              style={{
                gridTemplateColumns: `2rem repeat(${chromatinesValues.length}, 2.5rem)`,
              }}
            >
              {/* Corner */}
              <div />
              {/* Column headers */}
              {chromatinesValues.map((c) => (
                <div key={c} className="text-xs text-center leading-none select-none">
                  {c}
                </div>
              ))}

              {/* Rows */}
              {grid.map((row, ri) => (
                <Fragment key={ri}>
                  <div className="text-xs flex items-center justify-end pr-1 select-none">
                    {blacknessValues[ri]}
                  </div>
                  {row.map((cell, ci) => (
                    <ColorButton
                      key={ci}
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
                  ))}
                </Fragment>
              ))}
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}
