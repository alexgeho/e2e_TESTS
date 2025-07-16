import express from 'express';
import {getCoursesRouter} from './features/coursers/courses.router'
import {db} from './db/db'
import {getUsersRouter} from "./features/users/users.router";
import {getTestRouter} from "./routes/tests";

export const app = express();

export const RouterPaths ={
    courses: '/courses',
    users: '/users',
    __test__: '/__test__'
}

export const jsonBodyMiddleware = express.json();

app.use(jsonBodyMiddleware);

//app.use(RouterPaths.courses, getCoursesRouter(db))
app.use(RouterPaths.users, getUsersRouter(db))
app.use(RouterPaths.__test__, getTestRouter(db))
//app.use("/interesting", getInterstingRouter(db))

