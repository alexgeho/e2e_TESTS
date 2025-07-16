import {UserType, db, DBType, CourseType} from "../../db/db";
import {HTTP_STATUSES} from "../../utils";
import express, { Request, Response, Router } from "express"
import {QueryUserModel} from "./models/QueryUserModel";
import {UserViewModel} from "./models/UserViewModel";
import {CreateUserModel} from "./models/CreateUserModel";
import {URIParamsUserIdModel} from "./models/URIParamsUserIdModel";
import {UpdateUserModel} from "./models/UpdateUserModel";

type RequestWithBody<T> = Request<{}, {}, T>
type RequestWithQuery<T> = Request<{}, {}, T>
type RequestWithParams<T> = Request<T>
type RequestWithParamsAndBody<P, B> = Request<P, {}, B>




export const mapEntityToViewModel = (dbEntity: UserType): UserViewModel => {
    return {
        id: dbEntity.id,
        userName: dbEntity.userName
    }
}



export const getUsersRouter = (db: DBType): Router => {
    const router = express.Router()

    router.post(
        '/', (req: RequestWithBody<CreateUserModel>,
              res: Response<UserViewModel>): void => {
            if (!req.body.userName) {
                res.sendStatus(HTTP_STATUSES.BAD_REQUEST_400);
                return
            }
            const createdEntity: UserType = {
                id: +(new Date()),
                userName: req.body.userName
            };
            db.users.push(createdEntity)

            res
                .status(HTTP_STATUSES.CREATED_201)
                .json(mapEntityToViewModel(createdEntity))
        });


    router.get('/', (req: RequestWithQuery<QueryUserModel>,
                     res: Response<UserViewModel[]>) => {
        let foundEntities: UserType [] = db.users;
        if (req.query.userName) {
            const userName = req.query.userName as string;
            foundEntities = foundEntities.filter(c => c.userName.includes(userName));
        }

        res.json(foundEntities.map(mapEntityToViewModel));
    })


    router.get('/:id', (
        req: RequestWithParams<URIParamsUserIdModel>,
        res: Response<UserViewModel>): void => {
        const foundEntity: UserType | undefined = db.users.find(c => c.id === +req.params.id)

        if (!foundEntity) {
            res.sendStatus(HTTP_STATUSES.NOT_FOUND_404)
            return
        }
        res.json(mapEntityToViewModel(foundEntity));
    })


    router.delete('/:id', (
        req: RequestWithParams<URIParamsUserIdModel>,
        res) => {
        db.users = db.users.filter(c => c.id !== +req.params.id);

        res.sendStatus(HTTP_STATUSES.NO_CONTENT_204);
    })

        router.put('/:id', (req: RequestWithParamsAndBody<URIParamsUserIdModel, UpdateUserModel>,
                             res) => {
        if (!req.body.userName) {
            res.sendStatus(HTTP_STATUSES.NOT_FOUND_404)
            return
        }

        const foundUser = db.users.find(c => c.id === +req.params.id);

        if (!foundUser) {
            res.sendStatus(HTTP_STATUSES.NOT_FOUND_404)
            return
        }
        foundUser.userName = req.body.userName

        res.sendStatus(HTTP_STATUSES.NO_CONTENT_204);


    })

    return router

}