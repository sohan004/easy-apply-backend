const jwt = require("jsonwebtoken");

 const generateNewJsonToken =  (id, exp) => {
  return  jwt.sign({ id }, process.env.JWT_SECRET, {
    expiresIn: exp,
  });
};

 const verifyToken =  (token) => {
  return new Promise((resolve, reject) => {
    try {
      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      resolve(decoded);
    } catch (error) {
      resolve(false)
    }
  });
};


module.exports = {
  generateNewJsonToken,
  verifyToken
};
