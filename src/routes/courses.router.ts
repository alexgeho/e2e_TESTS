import express, {Router} from "express";
import {CourseType, db, DBType} from "../db/db";


export const getCourseViewModel
    = (dbCourse: CourseType):CourseViewModel => {
    return {
        id: dbCourse.id,
        title: dbCourse.title }}


export const getCoursesRouter = Router (db: DBType) => {
    const router: Router = express.Router()




    router.get('/courses', (req: Request, res: Response) => {
    let foundCourses = db.courses;

    res.json(foundCourses);
});

.get('/courses/:id', (req: Request, res: Response) => {
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

