const { isEmpty, isEmail, matches } = require("validator");
const mongoDBErrorHelper = require("./mongoDBErrorHelper");

const checkIfEmpty = (target) => {
  if (isEmpty(target)) {
    return true;
  } else {
    return false;
  }
};

const checkIfEmail = (target) => {
  if (isEmail(target)) {
    return true;
  } else {
    return false;
  }
};

const checkIfEmptyMiddleware = (req, res, next) => {
  let errorObj = {};
  let checkedEmail = false;

  const { email, password, firstName, lastName } = req.body;

  if (checkIfEmpty(firstName)) {
    errorObj.firstName = "First Name cannot be empty";
  }

  if (checkIfEmpty(lastName)) {
    errorObj.lastName = "Last Name cannot be empty";
  }

  if (checkIfEmpty(password)) {
    errorObj.password = "Password cannot be empty";
  }

  if (checkIfEmpty(email)) {
    errorObj.email = "Email cannot be empty";
    checkedEmail = true;
  }

  if (!checkedEmail) {
    if (!checkIfEmail(email)) {
      errorObj.email = "It must be in email format!";
    }
  }

  if (Object.keys(errorObj).length > 0) {
    res.status(500).json(mongoDBErrorHelper({ message: errorObj }));
  } else {
    next();
  }
};

const checkForSymbol = (target) => {
  if (matches(target, /[!@#$%^&*()\[\],.?":;{}|<>]/g)) {
    return true;
  } else {
    return false;
  }
};

const checkForSymbolMiddleware = (req, res, next) => {
  let errorObj = {};
  let { firstName, lastName } = req.body;

  if (checkForSymbol(firstName)) {
    errorObj.firstName = "First Name cannot contains special characters";
  }

  if (checkForSymbol(lastName)) {
    errorObj.lastName = "Last Name cannot contains special characters";
  }

  if (Object.keys(errorObj).length > 0) {
    res.status(500).json(mongoDBErrorHelper({ message: errorObj }));
  } else {
    next();
  }
};

const checkLoginIsEmpty = (req, res, next) => {
  let errorObj = {};

  const { email, password } = req.body;

  if (checkIfEmpty(email)) {
    errorObj.email = "Email cannot be empty";
  }

  if (checkIfEmpty(password)) {
    errorObj.password = "Password cannot be empty";
  }

  if (Object.keys(errorObj).length > 0) {
    res.status(500).json(mongoDBErrorHelper({ message: errorObj }));
  } else {
    next();
  }
};

module.exports = {
  checkIfEmptyMiddleware,
  checkForSymbolMiddleware,
  checkLoginIsEmpty,
};
