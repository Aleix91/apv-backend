import jwt from "jsonwebtoken";
import Veterinario from "../models/Veterinario.js";

const checkAuth = async (req, res, next) => {
    let token;

    if(req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
        try {
            token = req.headers.authorization.split(' ')[1];
            const decoded = jwt.verify(token, process.env.JWT_SECRET);
            req.veterinario = await Veterinario.findById(decoded.id).select("-password -token -confirmado");
            return next();

        } catch (error) {
            const error1 = new Error('Token no Válido');
            return res.status(403).json({msg: error1.message});
        }
    }

    if(!token) {
        const error = new Error('Token no Válido o Inexistente');
        res.status(403).json({msg: error.message});
    }

    next();
}

export default checkAuth;