import { FaCheck } from "react-icons/fa6";

const ProgressSteps = ({ step1, step2, step3 }) => {
  return (
    <div className="px-4 mx-auto flex justify-center items-center space-x-8 w-full max-w-lg">
      {" "}
      {/* Set max width */}
      {/* Step 1 - Login */}
      <div
        className={`flex flex-col items-center ${
          step1 ? "text-black-600" : "text-gray-400"
        }`}
      >
        <div className="flex items-center justify-center w-10 h-10 bg-pink-200 rounded-full">
          {step1 ? (
            <FaCheck size={20} />
          ) : (
            <span className="text-gray-400">1</span>
          )}
        </div>
        <span className="mt-2 text-xs sm:text-sm">Login</span>
      </div>
      {/* Connector */}
      <div
        className={`h-0.5 flex-1 ${step1 ? "bg-pink-600" : "bg-gray-300"}`}
      />
      {/* Step 2 - Shipping */}
      <div
        className={`flex flex-col items-center ${
          step2 ? "text-black-600" : "text-gray-400"
        }`}
      >
        <div className="flex items-center justify-center w-10 h-10 bg-pink-200 rounded-full">
          {step2 ? (
            <FaCheck size={20} />
          ) : (
            <span className="text-gray-400">2</span>
          )}
        </div>
        <span className="mt-2 text-xs sm:text-sm">Shipping</span>
      </div>
      {/* Connector */}
      <div
        className={`h-0.5 flex-1 ${
          step2 && step1 ? "bg-pink-600" : "bg-gray-300"
        }`}
      />
      {/* Step 3 - Summary */}
      <div
        className={`flex flex-col items-center ${
          step3 ? "text-black-600" : "text-gray-400"
        }`}
      >
        <div className="flex items-center justify-center w-10 h-10 bg-pink-200 rounded-full">
          {step3 ? (
            <FaCheck size={20} />
          ) : (
            <span className="text-gray-400">3</span>
          )}
        </div>
        <span className="mt-2 text-xs sm:text-sm">Summary</span>
      </div>
    </div>
  );
};

export default ProgressSteps;
