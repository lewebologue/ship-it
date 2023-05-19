const rateLimit = require("express-rate-limit");

const max = rateLimit({
  windowMs: 3 * 60 * 1000,
  max: 5,
});

module.exports = {max};