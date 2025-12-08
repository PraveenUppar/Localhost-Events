import { verifyPurchase } from "@/app/actions/verifyPurchase";
import Link from "next/link";
import { redirect } from "next/navigation";

interface PageProps {
  searchParams: Promise<{ session_id?: string }>;
}

export default async function SuccessPage({ searchParams }: PageProps) {
  const { session_id } = await searchParams;

  if (!session_id) redirect("/");

  // TRIGGERS THE VERIFICATION HERE
  const result = await verifyPurchase(session_id);

  if (!result.success) {
    return (
      <div className="p-10 text-center text-red-600">
        <h1>Error</h1>
        <p>{result.error}</p>
        <Link href="/" className="underline">
          Go Home
        </Link>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-10">
      <h1 className="text-3xl font-bold text-green-600 mb-4">Success!</h1>
      <p>Your ticket has been confirmed.</p>
      <Link
        href="/tickets"
        className="mt-8 bg-black text-white px-6 py-2 rounded"
      >
        View My Tickets
      </Link>
    </div>
  );
}
