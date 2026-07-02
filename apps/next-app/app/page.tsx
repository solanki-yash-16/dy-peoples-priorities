import { Button } from "@repo/ui";

export default function Home() {
  return (
    <div className="flex flex-col flex-1 items-center justify-center bg-zinc-50 font-sans">
      <div className="flex flex-col gap-4 text-base font-medium sm:flex-row">
        <button className="bg-red-500 text-white px-4 py-2 rounded">
          Simple Red Button
        </button>

        <Button>Outline</Button>
      </div>
    </div>
  );
}
