import express, {Router} from "express";
import {CourseType, db, DBType} from "../../db/db";
import {CourseViewModel} from "./models/CourseViewModel";
import {Request, Response} from "express";
import {HTTP_STATUSES} from "../../utils";


export const mapCourseToViewModel = (dbCourse: CourseType): CourseViewModel => {
    return {
        id: dbCourse.id,
        title: dbCourse.title
    }
};


export const getCoursesRouter = (db: DBType): Router => {
    const router = express.Router();

    router.get('/', (req: Request, res: Response) => {
        res.json(db.courses);
    });

    router.get('/:id', (req: Request, res: Response) => {
        const id = +req.params.id;
        const courseId = db.courses.find((course) => course.id === id);
        res.json(courseId);
    })

    router.post('/', (req: Request, res: Response) => {
        const courseNew = req.body;
        db.courses.push(courseNew);
        res.json(courseNew);
    })

    router.put('/:id', (req: Request, res: Response) => {
        const id = +req.params.id;
        let courseId = db.courses.find((course) => course.id === id);

        if (courseId) {
            courseId.title = req.body.title;
            courseId.studentsCount = req.body.studentsCount;
        }

        res.json(courseId);
    })

    router.delete ('/:id', (req: Request, res: Response) => {
        const id = +req.params.id;

        const findCourse = db.courses.findIndex((course)=>course.id === id);

        if (findCourse !== -1) {
            db.courses.splice(findCourse, 1);

        }


        res.json(HTTP_STATUSES.OK_200);
    })


    return router
}