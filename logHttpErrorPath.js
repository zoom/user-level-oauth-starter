// Expects express req object as paramter
const logHttpErrorPath = ({ originalUrl, method }) => `${method}: ${originalUrl}`;

module.exports = logHttpErrorPath;
