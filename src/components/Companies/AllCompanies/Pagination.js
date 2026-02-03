"use client";

const Pagination = ({ currentPage, totalPages, onPageChange, totalItems }) => {
  const handlePrevious = () => {
    if (currentPage > 1) {
      onPageChange(currentPage - 1);
    }
  };

  const handleNext = () => {
    if (currentPage < totalPages) {
      onPageChange(currentPage + 1);
    }
  };

  const handlePageClick = (page) => {
    onPageChange(page);
  };

  const getPageNumbers = () => {
    const pages = [];
    const maxPagesToShow = 4;
    
    if (totalPages <= maxPagesToShow) {
      for (let i = 1; i <= totalPages; i++) {
        pages.push(i);
      }
    } else {
      if (currentPage <= 2) {
        for (let i = 1; i <= maxPagesToShow; i++) {
          pages.push(i);
        }
      } else if (currentPage >= totalPages - 1) {
        for (let i = totalPages - maxPagesToShow + 1; i <= totalPages; i++) {
          pages.push(i);
        }
      } else {
        for (let i = currentPage - 1; i <= currentPage + 2; i++) {
          pages.push(i);
        }
      }
    }
    
    return pages;
  };

  const itemsPerPage = 10;
  const startItem = totalItems > 0 ? (currentPage - 1) * itemsPerPage + 1 : 0;
  const endItem = totalItems > 0 ? Math.min(currentPage * itemsPerPage, totalItems) : 0;

  return (
    <>
      <div className="p-4 pt-lg-4">
        <div className="d-flex justify-content-center justify-content-sm-between align-items-center text-center flex-wrap gap-2 showing-wrap">
          <span className="fs-12 fw-medium">
            Showing {startItem} to {endItem} of {totalItems} Results
          </span>

          <nav aria-label="Page navigation example">
            <ul className="pagination mb-0 justify-content-center">
              <li className={`page-item ${currentPage === 1 ? 'disabled' : ''}`}>
                <button
                  className="page-link icon border-0 bg-transparent"
                  onClick={handlePrevious}
                  aria-label="Previous"
                  disabled={currentPage === 1}
                >
                  <span className="material-symbols-outlined">
                    keyboard_arrow_left
                  </span>
                </button>
              </li>
              {getPageNumbers().map((page) => (
                <li key={page} className="page-item">
                  <button
                    className={`page-link ${currentPage === page ? 'active' : ''} border-0 bg-transparent`}
                    onClick={() => handlePageClick(page)}
                  >
                    {page}
                  </button>
                </li>
              ))}
              <li className={`page-item ${currentPage === totalPages ? 'disabled' : ''}`}>
                <button
                  className="page-link icon border-0 bg-transparent"
                  onClick={handleNext}
                  aria-label="Next"
                  disabled={currentPage === totalPages}
                >
                  <span className="material-symbols-outlined">
                    keyboard_arrow_right
                  </span>
                </button>
              </li>
            </ul>
          </nav>
        </div>
      </div>
    </>
  );
};

export default Pagination;

