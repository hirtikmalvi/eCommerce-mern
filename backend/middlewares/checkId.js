const { isValidObjectId } = require("mongoose");

function checkId(req, res, next) {
  if (!isValidObjectId(req.params.id)) {
    res.status(404).json({
      message: `Invalid Object Id `,
    });
    // throw new Error();
  }
  next();
}

module.exports = { checkId };
