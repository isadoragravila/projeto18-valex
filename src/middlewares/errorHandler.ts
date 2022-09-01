import { NextFunction, Request, Response } from "express";

export default function errorHandler (error: any, req: Request, res: Response, next: NextFunction) {
//   if (error.code === 'NotFound') {
//     return res.sendStatus(404);
//   }

  return res.sendStatus(500); // internal server error
}