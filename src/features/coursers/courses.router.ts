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

        if (!courseId) {
            res.sendStatus(HTTP_STATUSES.NOT_FOUND_404);
        }
        res.json(courseId);
    })


    router.post('/', (req: Request, res: Response) => {
        let courseNew = req.body;

        if (!req.body.title || typeof req.body.title !== "string" ) {
            res.sendStatus(HTTP_STATUSES.BAD_REQUEST_400);
            return
        }

        courseNew = {
            id: +(new Date()),
            title: req.body.title
        }

        db.courses.push(courseNew);

        res.status(HTTP_STATUSES.CREATED_201).json(courseNew);
    })



    router.put('/:id', (req: Request, res: Response) => {
        const id = +req.params.id;
        const course = db.courses.find(c => c.id === id);

        if (!course) {
            res.sendStatus(404);
            return;
        }

        if (typeof req.body.title !== 'string' || !req.body.title.trim()) {
            res.sendStatus(400);
            return;
        }

        course.title = req.body.title;
        course.studentsCount = req.body.studentsCount;
        res.json(course);

    })

    router.delete ('/:id', (req: Request, res: Response) => {
        const id = +req.params.id;

        const findCourse = db.courses.findIndex((course)=>course.id === id);

        if (findCourse !== -1) {
            db.courses.splice(findCourse, 1);
        }


        res.sendStatus(HTTP_STATUSES.NO_CONTENT_204);
    })


    return router
}