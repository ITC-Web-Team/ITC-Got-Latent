import LoginButton from "@/app/components/LoginButton";
import Image from "next/image";
import { JetBrains_Mono, IBM_Plex_Sans } from "next/font/google";

const mono = JetBrains_Mono({ subsets: ["latin"], weight: ["400", "600"] });
const sans = IBM_Plex_Sans({ subsets: ["latin"], weight: ["400", "500", "600", "700"] });

function CornerBrackets() {
  const base = "absolute h-6 w-6 border-amber-500/40 transition-colors group-hover:border-amber-500/70";
  return (
    <>
      <span className={`${base} left-0 top-0 border-l-2 border-t-2`} />
      <span className={`${base} right-0 top-0 border-r-2 border-t-2`} />
      <span className={`${base} bottom-0 left-0 border-b-2 border-l-2`} />
      <span className={`${base} bottom-0 right-0 border-b-2 border-r-2`} />
    </>
  );
}

export default function LoginPage() {
  return (
    <main
      className={`relative flex min-h-dvh flex-col items-center justify-center overflow-hidden bg-[#070b10] px-6 py-12 text-[#e2e8f0] ${sans.className}`}
    >
      {/* Dynamic Grid Backdrop */}
      <div
        className="pointer-events-none absolute inset-0 opacity-[0.03]"
        style={{
          backgroundImage:
            "radial-gradient(circle, #ffffff 1px, transparent 1px)",
          backgroundSize: "24px 24px",
        }}
      />
      
      {/* Background Spotlight Glow */}
      <div
        className="pointer-events-none absolute inset-0"
        style={{
          background:
            "radial-gradient(50% 50% at 50% 50%, rgba(245, 158, 11, 0.05), transparent 80%)",
        }}
      />

      <div className="relative z-10 flex w-full max-w-lg flex-col items-center">
        {/* Glowing Logo Container */}
        <div className="relative mb-6 p-1.5 rounded-2xl bg-slate-900 border border-slate-800 shadow-[0_0_20px_rgba(0,0,0,0.5)]">
          <Image
            src="/assets/logo.png"
            alt="ITC Web Team Logo"
            width={80}
            height={80}
            priority
            className="h-16 w-16 rounded-xl object-contain"
          />
        </div>

        <p className={`mb-3 text-[10px] font-bold tracking-[0.4em] text-amber-500 uppercase ${mono.className}`}>
          SYS://ITC-VOTING-PORTAL
        </p>

        <h1 className="text-center text-3xl font-extrabold leading-tight tracking-tight text-white sm:text-4xl lg:text-5xl max-w-md">
          Fifteen clubs.<br/>
          One slider.<br/>
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-amber-400 via-amber-200 to-amber-500 text-glow-amber">
            Zero mercy.
          </span>
        </h1>
        
        <p className="mt-4 max-w-sm text-center text-sm leading-relaxed text-slate-400">
          Authenticate through IITB SSO to enter the rating console. Drag the sliders, save your votes, and shape the leaderboard.
        </p>

        {/* Action Card Container */}
        <div className="relative group mt-10 w-full rounded-2xl border border-slate-800/80 bg-slate-950/65 p-8 md:p-10 shadow-[0_30px_60px_-15px_rgba(0,0,0,0.8)] backdrop-blur-md">
          <CornerBrackets />

          <div className="flex flex-col items-center gap-6 text-center">
            <div className={`flex items-center gap-2 text-[10px] font-bold uppercase tracking-wider text-slate-500 ${mono.className}`}>
              <span className="h-2 w-2 animate-pulse rounded-full bg-amber-500" />
              awaiting secure authentication
            </div>

            <div className="w-full max-w-xs transition-transform duration-300 hover:scale-[1.02]">
              <LoginButton />
            </div>

            <p className="text-[11px] text-slate-500 max-w-xs leading-normal">
              You will be redirected to the secure Single Sign-On service (sso.tech-iitb.org) for IIT Bombay.
            </p>
          </div>
        </div>
        
        <footer className="mt-16 text-center text-[10px] uppercase tracking-widest text-slate-600 font-mono">
          ITC Web Team &copy; {new Date().getFullYear()} &middot; Devs of IITB
        </footer>
      </div>
    </main>
  );
}
