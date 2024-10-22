const asyncHandler = (fn) => (req, res, next) => {
  Promise.resolve(fn(req, res, next)).catch((error) => {
    res.status(500).json({
      message: error.message,
      // filename: error.filename,
      // linenumber: error.lineNumber,
    });
  });
};

module.exports = asyncHandler;
