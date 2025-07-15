import express, {Router} from "express";
import {UserType, db, DBType } from "../../db/db";
import {HTTP_STATUSES} from "../../utils";
import {Request, Response} from "express";
import {QueryUserModel} from "./models/QueryUserModel";
import {UserViewModel} from "./models/UserViewModel";
import {CreateUserModel} from "./models/CreateUserModel";

export const mapEntityToViewModel= (dbEntity: UserType): UserViewModel =>
{
    return {
        id: dbEntity.id,
        userName: dbEntity.userName
    }
}



export const getUsersRouter = Router (db: DBType) => {
    const router: Router = express.Router()


    router.post(
        '/', ( req: RequestWithBody<CreateUserModel>,
                    res: Response<UserViewModel>): void => {
            if (!req.body.userName) {
                res.sendStatus(HTTP_STATUSES.BAD_REQUEST_400);
                return
            }
            const createdEntity: UserType = {
                id: +(new Date()),
                userName: req.body.userName};
            db.users.push(createdEntity)

            res
                .status(HTTP_STATUSES.CREATED_201)
                .json(mapEntityToViewModel(createdEntity))});


    router.get('/', (  req: RequestWithQuery<QueryUserModel>,
                            res: Response <UserViewModel[]>) => {
        let foundEntities: UserType = db.users;
if (req.query.userName) {
    foundEntities = foundEntities
        .filter(c => c.userName.indexOf(req.query.userName));
}
        res.json(foundEntities.map(mapEntityToViewModel));
    })



    router.get('/courses/:id', (req: Request, res: Response) => {
        const foundCourse = db.courses.find(course =>course.id === +req.params.id);
        if (!foundCourse) {
            return res.sendStatus(HTTP_STATUSES.NOT_FOUND_404);}

        res.json(foundCourse);


    } )

        .post('/courses', (req: Request, res: Response) => {
            if (!req.body.title) {
                return res.sendStatus(HTTP_STATUSES.BAD_REQUEST_400);
            }

            const createdCourse = {
                id: +new Date(),
                title: req.body.title,
            };
            db.courses.push(createdCourse);


            res.status(HTTP_STATUSES.CREATED_201).json(createdCourse);
        });

.delete('/courses/:id', (req: Request, res: Response) => {
        db.courses = db.courses.filter(c => c.id !== +req.params.id);
        res.sendStatus(HTTP_STATUSES.NO_CONTENT_204);
    });

.put('/courses/:id', (req: Request, res: Response) => {
        const foundCourse = db.courses.find(c => c.id === +req.params.id);
        if (!foundCourse) {
            return res.sendStatus(HTTP_STATUSES.NOT_FOUND_404);
        }

        // Валидация title
        if (
            typeof req.body.title !== 'string' ||
            req.body.title.trim().length === 0
        ) {
            return res.sendStatus(HTTP_STATUSES.BAD_REQUEST_400);
        }

        foundCourse.title = req.body.title;
        res.sendStatus(HTTP_STATUSES.NO_CONTENT_204);
    });



.delete('/__test__/data', (req: Request, res: Response) => {
        db.courses = [];
        res.sendStatus(HTTP_STATUSES.NO_CONTENT_204);
    });


}




