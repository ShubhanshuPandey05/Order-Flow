import jwt from "jsonwebtoken";

const genrateTokenAndSetCookies = (userId,res) => {
    const token = jwt.sign({userId},process.env.SECRET, {
        expiresIn: "999d"
    });

    res.cookie("jwt",token,{
        maxAge: 999 *24*60*60*1000, //MS
        httpOnly: true, //prevents the xss attack cross-site scripting attacks  using javascript
        sameSite: "strict" //prvents the CSRF (Cross Site Request Forgery )attacks by adding a security header to HTTP response
    })

}

export default genrateTokenAndSetCookies;