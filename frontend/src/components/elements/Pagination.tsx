import { ChevronLeft, ChevronRight, MoreHorizontal } from "lucide-react";

interface PaginationProps {
  items: number;
  pageSize: number;
  currentPage: number;
  onPageChange: (page: number) => void;
}

function Pagination({
  items,
  pageSize,
  currentPage,
  onPageChange,
}: PaginationProps) {
  const pagesCount = Math.ceil(items / pageSize);

  if (pagesCount <= 1) return null;

  const getPageRange = () => {
    const delta = 2;
    const range: (number | string)[] = [];

    for (let i = 1; i <= pagesCount; i++) {
      if (
        i === 1 ||
        i === pagesCount ||
        (i >= currentPage - delta && i <= currentPage + delta)
      ) {
        range.push(i);
      } else if (range[range.length - 1] !== "...") {
        range.push("...");
      }
    }
    return range;
  };

  return (
    <nav className="flex items-center justify-center space-x-2 py-8">
      <button
        onClick={() => onPageChange(currentPage - 1)}
        disabled={currentPage === 1}
        className="p-2 rounded-md border text-loom-text hover:bg-loom-gold disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
        aria-label="Previous page"
      >
        <ChevronLeft className="h-5 w-5" />
      </button>

      <div className="flex items-center gap-1">
        {getPageRange().map((page, index) => {
          if (page === "...") {
            return (
              <span key={`dots-${index}`} className="px-3 py-2 text-slate-400">
                <MoreHorizontal className="h-4 w-4" />
              </span>
            );
          }

          const isCurrent = page === currentPage;
          return (
            <button
              key={page}
              onClick={() => onPageChange(page as number)}
              className={`min-w-[40px] h-10 px-3 py-2 text-sm font-medium rounded-md transition-all ${
                isCurrent
                  ? "bg-loom-gold text-loom-text shadow-sm"
                  : "bg-loom-surface text-loom-text hover:bg-loom-gold-dim hover:text-loom-dark cursor-pointer"
              }`}
            >
              {page}
            </button>
          );
        })}
      </div>

      <button
        onClick={() => onPageChange(currentPage + 1)}
        disabled={currentPage === pagesCount}
        className="p-2 rounded-md border border-loom-border text-loom-text hover:bg-loom-gold disabled:opacity-30 disabled:cursor-not-allowed transition-colors cursor-pointer"
        aria-label="Next page"
      >
        <ChevronRight className="h-5 w-5" />
      </button>
    </nav>
  );
}

export default Pagination;
