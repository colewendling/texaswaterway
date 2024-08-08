import Link from 'next/link';

interface PaginationProps {
  totalPages: number;
  currentPage: number;
  query?: string;
}

const Pagination: React.FC<PaginationProps> = ({
  totalPages,
  currentPage,
  query,
}) => {
  if (totalPages <= 1) return null;

  return (
    <div className="pagination-container">
      {Array.from({ length: totalPages }, (_, i) => i + 1).map((pageNumber) => (
        <Link
          key={pageNumber}
          href={{
            pathname: '/',
            query: { query: query || undefined, page: pageNumber },
          }}
        >
          <button
            className={`pagination-button ${
              pageNumber === currentPage ? 'pagination-button-active' : ''
            }`}
          >
            {pageNumber}
          </button>
        </Link>
      ))}
    </div>
  );
};

export default Pagination;
