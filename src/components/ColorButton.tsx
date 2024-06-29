import { getColorCode } from "@/colors";
import { NcsColor } from "@/colors/ncsValues";

export const ColorButton = ({
  color,
  onClick,
  isSelected,
}: {
  color?: NcsColor;
  onClick: () => void;
  isSelected?: boolean;
}) => {
  if (!color) {
    return (
      <div
        className="p-5 text-center rounded min-w-32 max-w-32 hover:shadow-lg whitespace-nowrap text-xs"
        style={{
          backgroundColor: "grey",
          color: "black",
        }}
      >
        not available
      </div>
    );
  }

  return (
    <button
      className="p-5 text-center rounded min-w-32 hover:shadow-lg whitespace-nowrap text-slate-200"
      onClick={onClick}
      style={{
        backgroundColor: color?.hex,
        border: isSelected ? "1px solid silver" : "none",
      }}
    >
      {getColorCode(color)}
    </button>
  );
};
