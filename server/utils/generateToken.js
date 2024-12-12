import jwt from "jsonwebtoken";

const generateAndSetCookies = (userId) => {
    console.log(userId);
    return jwt.sign({userId},process.env.SECRET)
}

export default generateAndSetCookies;