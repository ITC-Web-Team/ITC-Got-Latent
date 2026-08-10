import LoginButton from "@/app/components/LoginButton";
import Image from "next/image";
 // adjust path if needed

export default function LoginPage() {
  return (
    <main className="relative min-h-screen bg-[#f4ecd8] text-[#3d3427]">
      {/* Top Left Logo */}
      <div className="md:absolute left-2 top-2 md:z-10">
        <Image
          src="/assets/logo.png"
          alt="ITC Web Team Logo"
          width={100}
          height={100}
          priority
          className="h-auto w-auto"
        />
      </div>

      <div className="mx-auto flex min-h-screen w-full max-w-5xl items-start px-6 pt-24 pb-12 md:items-center md:py-12 md:pt-0">
        <section className="grid w-full gap-10 rounded-[2rem] border border-[#e2d3b4] bg-[#fbf6ea] p-8 shadow-[0_20px_80px_rgba(115,88,46,0.12)] md:grid-cols-[1.15fr_0.85fr] md:p-12">
          <div className="space-y-6">
            <p className="text-sm font-semibold uppercase tracking-[0.25em] text-[#9a7b4f]">
              ITC Club Ratings
            </p>
            <h1 className="max-w-xl text-4xl font-semibold tracking-tight md:text-6xl">
              Rate every technical council club, one slider at a time.
            </h1>
            <p className="max-w-2xl text-lg leading-8 text-[#695943]">
              Sign in through IITB SSO to rate all 15 clubs on a 0–10 scale.
              Your ratings help the council understand what&apos;s resonating
              across campus.
            </p>
          </div>

          <div className="flex items-center justify-center rounded-[1.75rem] border border-dashed border-[#d7c3a0] bg-[#fffdf8] p-8">
            <div className="max-w-sm space-y-4 text-center">
              <h2 className="text-2xl font-semibold text-[#3d3427]">
                Continue with SSO
              </h2>
              <p className="text-sm leading-6 text-[#7a6a54]">
                Use your IITB SSO account to authenticate and start rating.
              </p>
              <LoginButton />
            </div>
          </div>
        </section>
      </div>
    </main>
  );
}
