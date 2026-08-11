"use client";

const PROJECT_ID = "aceda8ee-7427-4496-bf81-2333b2e05dfc";

export default function LoginButton() {
  const handleLogin = () => {
    window.location.href = `https://sso.tech-iitb.org/project/${PROJECT_ID}/ssocall/`;
  };

  return (
    <button
      onClick={handleLogin}
      className="w-full py-3.5 px-6 rounded-xl font-bold bg-gradient-to-r from-amber-500 via-amber-400 to-amber-600 text-slate-950 transition-all duration-300 hover:shadow-[0_0_25px_rgba(245,158,11,0.45)] hover:scale-[1.01] active:scale-[0.99] cursor-pointer flex items-center justify-center gap-2 border border-amber-300/20"
    >
      <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="2.5">
        <path strokeLinecap="round" strokeLinejoin="round" d="M11 16l-4-4m0 0l4-4m-4 4h14m-5 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 01-3-3h7a3 3 0 013 3v1" />
      </svg>
      Login with IITB SSO
    </button>
  );
}
