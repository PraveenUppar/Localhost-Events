import Spinner from "@/components/Spinner";

export default function Loading() {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-50/50 dark:bg-black/50 backdrop-blur-sm z-50">
      <Spinner />
      <p className="mt-4 text-slate-500 text-sm font-medium animate-pulse">
        Loading...
      </p>
    </div>
  );
}
