import Image from "next/image";

export function Loader() {
  return (
    <div className="flex h-[80vh] w-full items-center justify-center bg-neutral-50/5">
      <div className="flex flex-col items-center gap-2">
        <div className="relative flex h-28 w-28 items-center justify-center">
          <div className="absolute inset-0 rounded-full border-[3px] border-transparent border-t-brand border-r-brand/40 animate-[spin_2s_linear_infinite] drop-shadow-[0_0_12px_rgba(229,139,32,0.5)]" />
          <div className="relative flex h-46 w-46 items-center justify-center animate-pulse">
            <Image
              src="/prolog_logo.svg"
              alt="Logo"
              fill
              priority
              className="object-contain drop-shadow-[0_0_28px_rgba(229,139,32,0.6)]"
            />
          </div>
        </div>
        <p className="text-sm font-medium tracking-widest text-brand/80 animate-pulse uppercase">
          Loading...
        </p>
      </div>
    </div>
  );
}
