"use client";

import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import Image from "next/image";

export default function NotFound() {
  const router = useRouter();

  return (
    <div className="min-h-screen bg-white flex flex-col items-center justify-center p-4 text-center selection:bg-brand selection:text-black">
      <div className="relative flex justify-center items-center">
        <div className="animate-[bounce_2s_infinite]">
          <Image
            src="/prolog_logo.svg"
            width={400}
            height={400}
            alt="Prolog Logo"
            className="w-56 h-56 md:w-96 md:h-96 lg:w-[400px] lg:h-[400px] object-contain animate-pulse mix-blend-multiply"
          />
        </div>

        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-32 h-32 bg-brand/20 blur-[50px] rounded-full pointer-events-none" />
      </div>

      <h1 className="text-6xl md:text-8xl font-black text-black mb-2 tracking-tighter -mt-16 lg:-mt-40 relative z-10">
        4<span className="text-brand animate-pulse">0</span>4
      </h1>

      <h2 className="text-2xl md:text-3xl font-bold text-slate-700 mb-4 relative z-10">
        Houston, the arrow missed its mark.
      </h2>

      <p className="text-slate-500 max-w-lg mx-auto mb-10 text-base md:text-lg leading-relaxed relative z-10">
        We deployed the search drones to the deepest, darkest archives of our
        database, but it seems this page has completely vanished into the void.
      </p>

      <Button
        onClick={() => router.back()} 
        className="bg-brand hover:bg-brand/80 text-black border-2 border-brand px-8 py-6 rounded-lg font-bold text-lg shadow-lg hover:shadow-[0_0_25px_rgba(255,165,0,0.5)] hover:-translate-y-1 transition-all duration-300 group relative z-10"
      >
        <span className="mr-2 group-hover:-translate-x-1 transition-transform">
          ←
        </span>
        Retreat to Safety
      </Button>
    </div>
  );
}