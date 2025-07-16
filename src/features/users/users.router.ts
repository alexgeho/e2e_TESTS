import express, {Router} from "express";
import {UserType, db, DBType, CourseType} from "../../db/db";
import {HTTP_STATUSES} from "../../utils";
import {Request, Response} from "express";
import {QueryUserModel} from "./models/QueryUserModel";
import {UserViewModel} from "./models/UserViewModel";
import {CreateUserModel} from "./models/CreateUserModel";
import {URIParamsUserIdModel} from "./models/URIParamsUserIdModel";
import {UpdateUserModel} from "./models/UpdateUserModel";

export const mapEntityToViewModel = (dbEntity: UserType): UserViewModel => {
    return {
        id: dbEntity.id,
        userName: dbEntity.userName
    }
}


export const getUsersRouter = Router(db: DBType ) =>
{
    const router: Router = express.Router()

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
        let foundEntities: UserType = db.users;
        if (req.query.userName) {
            foundEntities = foundEntities
                .filter(c => c.userName.indexOf(req.query.userName));
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

        .router.put('/:id', (req: RequestWithParamsAndBody<URIParamsUserIdModel, UpdateUserModel>,
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