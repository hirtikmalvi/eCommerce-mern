import { useEffect, useState } from "react";
import Loader from "../../components/Loader";
import { useGetTopProductsQuery } from "../../redux/api/productApiSlice";
import { Link } from "react-router-dom";

const ProductCarousel = () => {
  const { data: products, isLoading, error } = useGetTopProductsQuery();
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isHovered, setIsHovered] = useState(false);

  if (isLoading) {
    return <Loader />;
  }

  if (error) {
    return <div>Error loading products.</div>;
  }

  const nextSlide = () => {
    setCurrentIndex((prevIndex) => (prevIndex + 1) % products.length);
  };

  const prevSlide = () => {
    setCurrentIndex(
      (prevIndex) => (prevIndex - 1 + products.length) % products.length
    );
  };

  // Automatically move to the next slide every 2.8 seconds
  useEffect(() => {
    const intervalId = setInterval(() => {
      if (!isHovered) nextSlide();
    }, 2500);
    return () => clearInterval(intervalId); // Clean up the interval on component unmount
  }, [isHovered]);

  return (
    <div
      id="default-carousel"
      className="relative w-full"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <div className="relative overflow-hidden rounded-lg  xl:h-[40rem] lg:h-[25rem] md:h-[15rem] sm:h-96 h-56 mb-5 bg-white">
        {products.map((product, index) => (
          <div
            key={product._id}
            className={`absolute inset-0 transition-transform duration-700 ease-in-out transform ${
              currentIndex === index
                ? "opacity-100 translate-x-0"
                : (currentIndex + 1) % products.length === index
                ? "opacity-0 -translate-x-full"
                : (currentIndex - 1 + products.length) % products.length ===
                  index
                ? "opacity-0 translate-x-full"
                : "opacity-0"
            }`}
          >
            <div
              // to={`/product/${product._id}`}
              onClick={() => {
                console.log(product.name, product._id, " is CLicked");
              }}
            >
              <span
                className={`absolute text-white font-semibold text-sm ml-10 mt-8
                  xl:text-3xl lg:text-3xl md:text-3xl sm:text-xl`}
              >
                {product.name}
                <p className="text-small ml-1">by {product.brand}</p>
              </span>
            </div>

            <img
              src={product.image}
              className="block w-full h-full object-cover"
              alt={product.name}
            />
            {/* <Link to={`/product/${product._id}`}></Link> */}
          </div>
        ))}
      </div>

      {/* Carousel indicators */}
      <div className="absolute z-30 flex -translate-x-1/2 bottom-5 left-1/2 space-x-3">
        {products.map((_, index) => (
          <button
            key={index}
            type="button"
            className={`w-3 h-3 rounded-full ${
              currentIndex === index ? "bg-gray-500" : "bg-gray-300"
            }`}
            onClick={() => setCurrentIndex(index)}
            aria-label={`Slide ${index + 1}`}
          />
        ))}
      </div>

      {/* Previous Button */}
      <button
        onClick={prevSlide}
        className="absolute top-0 start-0 z-30 flex items-center justify-center h-full px-4 cursor-pointer group focus:outline-none"
      >
        <span className="inline-flex items-center justify-center w-10 h-10 rounded-full bg-white/90 group-hover:bg-white/100 group-focus:ring-4 group-focus:ring-white">
          <svg
            className="w-4 h-4 text-gray-800"
            aria-hidden="true"
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 6 10"
          >
            <path
              stroke="currentColor"
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              d="M5 1 1 5l4 4"
            />
          </svg>
          <span className="sr-only">Previous</span>
        </span>
      </button>

      {/* Next Button */}
      <button
        onClick={nextSlide}
        className="absolute top-0 end-0 z-30 flex items-center justify-center h-full px-4 cursor-pointer group focus:outline-none"
      >
        <span className="inline-flex items-center justify-center w-10 h-10 rounded-full bg-white/90 group-hover:bg-white/100 group-focus:ring-4 group-focus:ring-white">
          <svg
            className="w-4 h-4 text-gray-800"
            aria-hidden="true"
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 6 10"
          >
            <path
              stroke="currentColor"
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              d="m1 9 4-4-4-4"
            />
          </svg>
          <span className="sr-only">Next</span>
        </span>
      </button>
    </div>
  );
};

export default ProductCarousel;

// {
//   <div id="default-carousel" className="relative w-full" data-carousel="slide">
//     {/* Carousel container */}
//     <div className="relative h-56 overflow-hidden rounded-lg md:h-96 bg-white">
//       {/* Carousel slides */}
//       <div className="hidden duration-700 ease-in-out" data-carousel-item>
//         <img
//           src="/docs/images/carousel/carousel-1.svg"
//           className="absolute block w-full -translate-x-1/2 -translate-y-1/2 top-1/2 left-1/2"
//           alt="..."
//         />
//       </div>
//       <div className="hidden duration-700 ease-in-out" data-carousel-item>
//         <img
//           src="/docs/images/carousel/carousel-2.svg"
//           className="absolute block w-full -translate-x-1/2 -translate-y-1/2 top-1/2 left-1/2"
//           alt="..."
//         />
//       </div>
//       <div className="hidden duration-700 ease-in-out" data-carousel-item>
//         <img
//           src="/docs/images/carousel/carousel-3.svg"
//           className="absolute block w-full -translate-x-1/2 -translate-y-1/2 top-1/2 left-1/2"
//           alt="..."
//         />
//       </div>
//       <div className="hidden duration-700 ease-in-out" data-carousel-item>
//         <img
//           src="/docs/images/carousel/carousel-4.svg"
//           className="absolute block w-full -translate-x-1/2 -translate-y-1/2 top-1/2 left-1/2"
//           alt="..."
//         />
//       </div>
//       <div className="hidden duration-700 ease-in-out" data-carousel-item>
//         <img
//           src="/docs/images/carousel/carousel-5.svg"
//           className="absolute block w-full -translate-x-1/2 -translate-y-1/2 top-1/2 left-1/2"
//           alt="..."
//         />
//       </div>
//     </div>

//     {/* Carousel indicators */}
//     <div className="absolute z-30 flex -translate-x-1/2 bottom-5 left-1/2 space-x-3">
//       <button
//         type="button"
//         className="w-3 h-3 rounded-full bg-gray-300"
//         aria-current="true"
//         aria-label="Slide 1"
//         data-carousel-slide-to="0"
//       ></button>
//       <button
//         type="button"
//         className="w-3 h-3 rounded-full bg-gray-300"
//         aria-current="false"
//         aria-label="Slide 2"
//         data-carousel-slide-to="1"
//       ></button>
//       <button
//         type="button"
//         className="w-3 h-3 rounded-full bg-gray-300"
//         aria-current="false"
//         aria-label="Slide 3"
//         data-carousel-slide-to="2"
//       ></button>
//       <button
//         type="button"
//         className="w-3 h-3 rounded-full bg-gray-300"
//         aria-current="false"
//         aria-label="Slide 4"
//         data-carousel-slide-to="3"
//       ></button>
//       <button
//         type="button"
//         className="w-3 h-3 rounded-full bg-gray-300"
//         aria-current="false"
//         aria-label="Slide 5"
//         data-carousel-slide-to="4"
//       ></button>
//     </div>

//     {/* Carousel navigation buttons */}
//     <button
//       type="button"
//       className="absolute top-0 start-0 z-30 flex items-center justify-center h-full px-4 cursor-pointer group focus:outline-none"
//       data-carousel-prev
//     >
//       <span className="inline-flex items-center justify-center w-10 h-10 rounded-full bg-white/90 group-hover:bg-white/100 group-focus:ring-4 group-focus:ring-white">
//         <svg
//           className="w-4 h-4 text-gray-800"
//           aria-hidden="true"
//           xmlns="http://www.w3.org/2000/svg"
//           fill="none"
//           viewBox="0 0 6 10"
//         >
//           <path
//             stroke="currentColor"
//             strokeLinecap="round"
//             strokeLinejoin="round"
//             strokeWidth="2"
//             d="M5 1 1 5l4 4"
//           />
//         </svg>
//         <span className="sr-only">Previous</span>
//       </span>
//     </button>
//     <button
//       type="button"
//       className="absolute top-0 end-0 z-30 flex items-center justify-center h-full px-4 cursor-pointer group focus:outline-none"
//       data-carousel-next
//     >
//       <span className="inline-flex items-center justify-center w-10 h-10 rounded-full bg-white/90 group-hover:bg-white/100 group-focus:ring-4 group-focus:ring-white">
//         <svg
//           className="w-4 h-4 text-gray-800"
//           aria-hidden="true"
//           xmlns="http://www.w3.org/2000/svg"
//           fill="none"
//           viewBox="0 0 6 10"
//         >
//           <path
//             stroke="currentColor"
//             strokeLinecap="round"
//             strokeLinejoin="round"
//             strokeWidth="2"
//             d="m1 9 4-4-4-4"
//           />
//         </svg>
//         <span className="sr-only">Next</span>
//       </span>
//     </button>
//   </div>;
// }
