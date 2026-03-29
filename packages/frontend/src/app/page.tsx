import { PurchaseUI } from "@/components/PurchaseUI";

export default function Home() {
  return (
    <main className="min-h-screen bg-black flex items-center justify-center p-4">
      <div className="w-full max-w-4xl">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-green-400 to-blue-500">
            BlindDrop
          </h1>
          <p className="text-gray-400 mt-2">
            Anti-bot presale infrastructure powered by Fhenix FHE
          </p>
        </div>
        <PurchaseUI />
      </div>
    </main>
  );
}
