import { Suspense } from "react";
import { ColorPicker } from "@/components/ColorPicker";

export default function Home() {
  return (
    <Suspense>
      <ColorPicker />
    </Suspense>
  );
}
