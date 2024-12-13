import jwt from "jsonwebtoken";

const generateAndSetCookies = (userId) => {
    console.log(userId);
    return jwt.sign({userId},process.env.SECRET,{expiresIn:'100y'})
}

export default generateAndSetCookies;