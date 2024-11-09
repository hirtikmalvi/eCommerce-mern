import { FaArrowLeftLong } from "react-icons/fa6";
import { FaArrowRightLong } from "react-icons/fa6";

const Pagination = ({ previousPage, nextPage, currentPage, pages }) => {
  return (
    <div className="flex justify-center items-center mt-5">
      <button
        // href="#"
        className="flex items-center justify-center px-3 h-8 me-3 text-sm font-medium text-white bg-pink-600 border rounded-lg hover:bg-pink-700"
        disabled={currentPage == 1 ? true : false}
        onClick={previousPage}
      >
        <FaArrowLeftLong /> &nbsp; Previous
      </button>
      <span className="text-black font-semibold">
        {currentPage} &nbsp;/ &nbsp;{pages} &nbsp;
      </span>
      &nbsp;
      <button
        // href="#"
        className="flex items-center justify-center px-3 h-8 me-3 text-sm font-medium text-white bg-pink-600 border rounded-lg hover:bg-pink-700"
        disabled={currentPage == pages ? true : false}
        onClick={nextPage}
      >
        Next &nbsp;
        <FaArrowRightLong />
      </button>
    </div>
  );
};
export default Pagination;
