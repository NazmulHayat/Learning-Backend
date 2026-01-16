import jwt from 'jsonwebtoken'

function authMiddleware(req, res, next) {
    console.log('inside(authmiddlware bro')
    const token = req.headers['authorization']

    if (!token) {
        return res.status(401).json({ message: "No token provided bro" })
    }
    jwt.verify(token, process.env.JWT_SECRET, (err, decoded) => {
        if (err) return res.status(401).json({ message: "Invalid token" })
        req.userId = decoded.id
        next()
    })
}


export default authMiddleware 
