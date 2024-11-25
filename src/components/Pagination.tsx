import React from "react";
import { PaginationProps } from "../interfaces";

const Pagination: React.FC<PaginationProps> = ({
  pageProp,
  goAhead,
  goBack,
  page,
  totalPages,
}) => {
  return (
    <div className="w-full flex justify-center mb-6">
      <button
        className={`p-2 border-2 border-blue-600 border-r-0 bg-blue-600 rounded-l-xl text-lg text-white ${
          page === 1 ? "cursor-not-allowed" : "cursor-pointer"
        }`}
        onClick={goBack}
        disabled={page === 1}
      >
        Previous
      </button>

      <button className="p-2 border-2 border-blue-600 text-blue-600 bg-gray-100 text-lg font-semibold">
        {pageProp}
      </button>
      <button
        className={`p-2 border-2 border-blue-700 bg-blue-600 border-l-0 rounded-r-xl text-lg text-white ${page===totalPages ? 'cursor-not-allowed' : 'cursor-pointer'}`}
        onClick={goAhead}
      >
        Next
      </button>
    </div>
  );
};

export default Pagination;