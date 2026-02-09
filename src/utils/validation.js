const validator = require("validator");

const validationSignUpData = (req) => {
  const { firstName, lastName, emailId, password } = req.body;

  if (!firstName || !lastName) {
    throw new Error("first and last names are required ");
  } else if (!validator.isEmail(emailId)) {
    throw new Error("the email is not correct ! Please Enter a valid Email");
  } else if (!validator.isStrongPassword(password)) {
    throw new Error(
      "the password is not valid ! Please Enter a valid strong password",
    );
  }
};

const validateProfileEditdata = (req) => {
  const allowedEditFeilds = [
    "firstName",
    "lastName",
    "emailId",
    "age",
    "photoUrl",
    "about",
    "skills",
  ];

  const isFeildAllowed = Object.keys(req.body).every((field) =>
    allowedEditFeilds.includes(field),
  );

  return isFeildAllowed;
};

const validatePassword = (req) => {
  const { password } = req.body;

  if (!validator.isStrongPassword(password)) {
    throw new Error("Password is not strong enough");
  }
  return password;
};

module.exports = {
  validationSignUpData,
  validateProfileEditdata,
  validatePassword,
};
