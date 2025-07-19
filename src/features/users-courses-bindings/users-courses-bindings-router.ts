import {UserType, db, DBType, CourseType, UserCourseBindingType} from "../../db/db";
import {HTTP_STATUSES} from "../../utils";
import express, {Request, Response, Router} from "express"
import {UserCourseBindingViewModel} from "./models/UserCourseBindingViewModel";
import {CreateUserCourseBindingModel} from "./models/CreateUserCourseBindingModel";

type RequestWithBody<T> = Request<{}, {}, T>
type RequestWithQuery<T> = Request<{}, {}, T>
type RequestWithParams<T> = Request<T>
type RequestWithParamsAndBody<P, B> = Request<P, {}, B>


export const mapEntityToViewModel = (dbEntity: UserCourseBindingType, foundUser: UserType, foundCourse: CourseType): {
    userId: number;
    courseId: number;
    date: Date;
    userName: string;
    title: string
} => {
    return {
        userId: dbEntity.userId,
        courseId: dbEntity.courseId,
        date: dbEntity.date,
        userName: foundUser.userName,
        title: foundCourse.title
    }}

export const usersCoursesBindingsRouter = (db: DBType): Router => {
    const router = express.Router()

    router.post(
        '/', (req: RequestWithBody<CreateUserCourseBindingModel>,
              res: Response<UserCourseBindingViewModel>): void => {



            const foundUser = db.users.find(u => u.id === req.body.userId)
            const foundCourse = db.courses.find(c => c.id === req.body.courseId)

            if (!foundUser || !foundCourse) {
                res.sendStatus(HTTP_STATUSES.BAD_REQUEST_400);
                return
            }

            const alreadyExistingBinding = db.userCourseBindings
                .find(b => b.userId === foundUser.id && b.courseId === foundCourse.id)

            if (!!alreadyExistingBinding) {
                res.sendStatus(HTTP_STATUSES.BAD_REQUEST_400);

                return
            }

            const createdEntity: UserCourseBindingType = {
                userId: foundUser.id,
                courseId: foundCourse.id,
                date: new Date()
            };
            db.userCourseBindings.push(createdEntity)

            res
                .status(HTTP_STATUSES.CREATED_201)
                .json(mapEntityToViewModel(createdEntity, foundUser, foundCourse ))
        });

    //
    // router.get('/', (req: RequestWithQuery<QueryUserModel>,
    //                  res: Response<UserViewModel[]>) => {
    //     let foundEntities: UserType [] = db.users;
    //     if (req.query.userName) {
    //         const userName = req.query.userName as string;
    //         foundEntities = foundEntities.filter(c => c.userName.includes(userName));
    //     }
    //
    //     res.json(foundEntities.map(mapEntityToViewModel));
    // })
    //
    //
    // router.get('/:id', (
    //     req: RequestWithParams<URIParamsUserIdModel>,
    //     res: Response<UserViewModel>): void => {
    //     const foundEntity: UserType | undefined = db.users.find(c => c.id === +req.params.id)
    //
    //     if (!foundEntity) {
    //         res.sendStatus(HTTP_STATUSES.NOT_FOUND_404)
    //         return
    //     }
    //     res.json(mapEntityToViewModel(foundEntity));
    // })
    //
    //
    // router.delete('/:id', (
    //     req: RequestWithParams<URIParamsUserIdModel>,
    //     res) => {
    //     db.users = db.users.filter(c => c.id !== +req.params.id);
    //
    //     res.sendStatus(HTTP_STATUSES.NO_CONTENT_204);
    // })
    //
    // router.put('/:id', (req: RequestWithParamsAndBody<URIParamsUserIdModel, UpdateUserModel>,
    //                     res) => {
    //     if (!req.body.userName) {
    //         res.sendStatus(HTTP_STATUSES.BAD_REQUEST_400)
    //         return
    //     }
    //
    //     const foundUser = db.users.find(c => c.id === +req.params.id);
    //
    //     if (!foundUser) {
    //         res.sendStatus(HTTP_STATUSES.NOT_FOUND_404)
    //         return
    //     }
    //     foundUser.userName = req.body.userName
    //
    //     res.sendStatus(HTTP_STATUSES.NO_CONTENT_204);
    //
    //
    // })

    return router

}