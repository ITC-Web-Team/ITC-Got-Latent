import LoginButton from "@/app/components/LoginButton";
import Image from "next/image";
import { JetBrains_Mono, IBM_Plex_Sans } from "next/font/google";

const mono = JetBrains_Mono({ subsets: ["latin"], weight: ["400", "600"] });
const sans = IBM_Plex_Sans({ subsets: ["latin"], weight: ["400", "500", "600"] });

function CornerBrackets() {
  const base = "absolute h-6 w-6 border-[#ffb454]/70";
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
      className={`relative flex min-h-dvh items-center justify-center overflow-hidden bg-[#0b0f14] px-6 py-12 text-[#e7edf3] ${sans.className}`}
    >
      {/* Faint dot-grid backdrop — inline style so it doesn't depend on the
          Tailwind JIT correctly parsing a multi-value arbitrary background */}
      <div
        className="pointer-events-none absolute inset-0 opacity-40"
        style={{
          backgroundImage:
            "radial-gradient(circle, #1f2a37 1px, transparent 1px)",
          backgroundSize: "28px 28px",
        }}
      />
      <div
        className="pointer-events-none absolute inset-0"
        style={{
          background:
            "radial-gradient(60% 50% at 50% 0%, rgba(255,180,84,0.08), transparent 70%)",
        }}
      />

      <div className="relative z-10 flex w-full max-w-md flex-col items-center">
        <Image
          src="/assets/image.jpg"
          alt="ITC Web Team Logo"
          width={72}
          height={72}
          priority
          className="mb-6 h-auto w-16 rounded-lg"
        />

        <p className={`mb-2 text-xs tracking-[0.35em] text-[#ffb454] ${mono.className}`}>
          SYS://ITC-RATINGS
        </p>

        <h1 className="text-center text-3xl font-semibold leading-tight tracking-tight text-[#f4f7fa] sm:text-4xl">
          Rate every technical council club.
        </h1>
        <p className="mt-3 max-w-sm text-center text-sm leading-6 text-[#7c8a99]">
          Sign in with your IITB SSO account to rate all 15 clubs on a 0–10
          scale. Takes about two minutes.
        </p>

        <div className="relative mt-10 w-full rounded-lg border border-[#1f2a37] bg-[#10161d] p-8">
          <CornerBrackets />

          <div className="flex flex-col items-center gap-5 text-center">
            <div className={`flex items-center gap-2 text-xs text-[#7c8a99] ${mono.className}`}>
              <span className="h-2 w-2 animate-pulse rounded-full bg-[#ffb454]" />
              awaiting authentication
            </div>

            <LoginButton />

            <p className="text-xs text-[#5c6773]">
              You&apos;ll be redirected to sso.tech-iitb.org
            </p>
          </div>
        </div>
      </div>
    </main>
  );
}

