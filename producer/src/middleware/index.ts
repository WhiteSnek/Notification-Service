import { NextFunction, Request, Response } from "express";
import jwt from 'jsonwebtoken'
import jwksClient from "jwks-rsa";
import dotenv from "dotenv";
dotenv.config();
const client = jwksClient({
  jwksUri: `${process.env.IDP_URL}/oauth/.well-known/jwks.json`,
});

function getKey(header: any, callback: any) {
  client.getSigningKey(header.kid, (err, key) => {
    const signingKey = key?.getPublicKey();
    callback(err, signingKey);
  });
}

const middleware = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const token = req.headers.authorization?.split(" ")[1];
    const idpUrl = process.env.IDP_URL as string;
    if (!token) {
      return res.status(401).json({
        message: "Authentication required",
      });
    }
    const decoded = await new Promise<any>((resolve, reject) => {
      jwt.verify(
        token,
        getKey,
        {
          audience: "notification_service",
          issuer: idpUrl,
        },
        (err, decoded) => {
          if (err) return reject(err);
          resolve(decoded);
        }
      );
    });
    if(!decoded.permissions.notification){
        return res.status(401).json({message: "Notification not allowed!"})
    }
    req.clientId = decoded.sub;
    req.channels = decoded.permissions.channels;
    next();
  } catch (error) {
    return res.status(401).json({
      message: "Invalid or expired token",
    });
  }
};

export default middleware

