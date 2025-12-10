"use client";

import { Search as SearchIcon } from "lucide-react";
import { useSearchParams, usePathname, useRouter } from "next/navigation";
import { useDebouncedCallback } from "use-debounce";

export default function Search() {
  const searchParams = useSearchParams();
  const pathname = usePathname();
  const { replace } = useRouter();

  const handleSearch = useDebouncedCallback((term: string) => {
    const params = new URLSearchParams(searchParams);
    if (term) {
      params.set("query", term);
    } else {
      params.delete("query");
    }
    replace(`${pathname}?${params.toString()}`);
  }, 300);

  return (
    <div className="relative flex flex-1 shrink-0">
      <label htmlFor="search" className="sr-only">
        Search
      </label>

      {/* Search Icon - Changes color on focus via group/peer classes if needed, 
          but here we keep it simple with text-slate-500 */}
      <SearchIcon className="absolute left-4 top-1/2 h-[18px] w-[18px] -translate-y-1/2 text-slate-500 peer-focus:text-blue-500 transition-colors duration-300 z-10" />

      <input
        onChange={(e) => handleSearch(e.target.value)}
        defaultValue={searchParams.get("query")?.toString()}
        placeholder="Search events..."
        className="peer block w-full rounded-xl border border-white/10 bg-slate-950/50 py-4 pl-12 pr-4 text-sm text-white outline-none placeholder:text-slate-500 focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition-all duration-300 shadow-[0_4px_20px_-2px_rgba(0,0,0,0.5)] backdrop-blur-sm"
      />
    </div>
  );
}
