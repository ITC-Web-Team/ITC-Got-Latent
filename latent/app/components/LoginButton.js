"use client";

const PROJECT_ID = "aceda8ee-7427-4496-bf81-2333b2e05dfc";

export default function LoginButton() {
  const handleLogin = () => {
    window.location.href = `https://sso.tech-iitb.org/project/${PROJECT_ID}/ssocall/`;
  };

  return (
    <button
      onClick={handleLogin}
      className="rounded-md bg-[#ffb454] px-6 py-3 font-semibold text-[#1a1206] transition-colors hover:bg-[#ffc476]"
    >
      Login with SSO
    </button>
  );
}
