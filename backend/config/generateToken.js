import jwt from "jsonwebtoken";

const generateToken = (id, email, name) => {

  const payload = {
    id, 
    email,
    name,
  }

  const options = {
    expiresIn: "30d",
    algorithm: "HS256",
  }

  return jwt.sign(payload, process.env.JWT_SECRET, options);
};

export default generateToken;
