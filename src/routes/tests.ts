import express, {Router} from "express";
import {HTTP_STATUSES} from "../utils";
import {Request, Response} from "express";
import {DBType} from "../db/db";


export const getTestRouter = (db: DBType) => {
    const router: Router = express.Router();

    router.delete('/data', (req: Request, res: Response) => {
        db.courses = [];
        db.users = [];
        db.userCourseBindings = [];
        res.sendStatus(HTTP_STATUSES.NO_CONTENT_204);
    });

    return router;
}
