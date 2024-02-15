import { NextFunction, Request, Response } from "express";

export default function verifyFields(req: Request, res: Response, next: NextFunction){
    const {name, password, email, phone, functions} = req.body;
    
    if(!name || !password || !email || !phone || !functions){
        return res.status(400).json({
            ok: false, message: "Missing required fields"
        });
    }

    next();
}