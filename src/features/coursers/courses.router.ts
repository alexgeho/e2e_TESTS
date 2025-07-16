import express, {Router} from "express";
import {CourseType, db, DBType} from "../../db/db";
import {CourseViewModel} from "./models/CourseViewModel";
import {Request, Response} from "express";
import {HTTP_STATUSES} from "../../utils";


export const mapCourseToViewModel = (dbCourse: CourseType):CourseViewModel => {
    return {
        id: dbCourse.id,
        title: dbCourse.title }};


export const getCoursesRouter = (db: DBType):Router => {
    const router = express.Router();

    router.get('/courses', (req: Request, res: Response) => {
    let foundCourses = db.courses;

    res.json(foundCourses);
});


    return router
}

