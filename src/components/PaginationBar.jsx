import React from "react";

export default function PaginationBar ({ total, limit, currentPage, setCurrentPage }) {
  const numberOfPages = Math.ceil(total / limit);

  const handlePrevClick = () => {
    setCurrentPage(currentPage - 1);
  };

  const handleNextClick = () => {
    setCurrentPage(currentPage + 1);
  };

  const handleNumberClick = (i) => {
    setCurrentPage(i + 1);
  };

  return (
    <>
      <div className="pagination__container">
        <button
          className="pagination__button"
          onClick={handlePrevClick}
          disabled={currentPage === 1}
        >
          &lt;
        </button>
        {Array(numberOfPages)
          .fill()
          .map((_, i) => (
            <button
              className={currentPage === i + 1 ? "pagination__button pagination__button--checked" : "pagination__button"}
              onClick={() => handleNumberClick(i)}
              key={i + 1}
            >
              {i + 1}
            </button>
          ))}
        <button
          className="pagination__button"
          onClick={handleNextClick}
          disabled={currentPage === numberOfPages}
        >
          &gt;
        </button>
      </div>
    </>
  );
}
