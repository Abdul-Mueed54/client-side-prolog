import React from "react";
import { ArrowRight } from "lucide-react";
import Image from "next/image";
import Link from "next/link";

function LoginPageLeftSide() {
  return (
    <div className="w-full md:w-5/12 bg-slate-50 border-r border-slate-200 p-8 md:p-16 flex flex-col justify-between relative overflow-hidden">
      {/* Subtle decorative background element */}
      <div className="absolute -top-24 -left-24 w-96 h-96 rounded-full blur-3xl pointer-events-none"></div>

      <div className="relative z-10">
        {/* Logo Integration */}
        <div className="mb-8">
          <Image
            src="/prolog.svg"
            alt="ProLog University Project Catalog Logo"
            width={700}
            height={700}
            className="object-contain drop-shadow-sm"
            priority
          />
        </div>

        <p className="text-slate-m text-base leading-relaxed mb-8 max-w-md">
          A centralized digital archive and search engine for Final Year Design
          Projects. Discover, catalog, and collaborate on student innovations
          across all university departments.
        </p>
      </div>

      <div className="relative z-10 mt-12 md:mt-0">
        <div className="p-6 bg-white border border-slate-200 shadow-sm">
          <h3 className="text-sm font-bold text-slate-900 uppercase tracking-widest mb-2">
            Public Access
          </h3>
          <p className="text-sm text-slate-m mb-6">
            Browse the catalog without an account. You can view project titles,
            abstracts, and domains.
          </p>
          <Link
            href="/guest"
            className="inline-flex items-center gap-2 text-sm font-bold tracking-widest uppercase text-white bg-brand hover:bg-[#d88c20] transition-colors px-6 py-3"
          >
            Enter as Guest <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
      </div>
    </div>
  );
}

export default LoginPageLeftSide;
