import { redirect } from "next/navigation";
import { getCurrentUser } from "@/lib/auth";
import RatingForm from "@/app/components/RatingForm";
import { CLUBS } from "@/lib/clubs";

export default async function HomePage() {
  const user = await getCurrentUser();
  if (!user) {
    redirect("/login");
  }

  return (
    <main className="min-h-screen bg-[#f4ecd8] px-6 py-12 text-[#3d3427]">
      <RatingForm clubs={CLUBS} userName={user!.name} />
    </main>
  );
}
