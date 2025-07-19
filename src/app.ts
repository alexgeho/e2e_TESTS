import express from 'express';
import {getCoursesRouter} from './features/coursers/courses.router'
import {db} from './db/db'
import {getUsersRouter} from "./features/users/users.router";
import {getTestRouter} from "./routes/tests";
import {usersCoursesBindingsRouter} from "./features/users-courses-bindings/users-courses-bindings-router";

export const app = express();

export const RouterPaths ={
    courses: '/courses',
    users: '/users',
    __test__: '/__test__',
    userCoursesBindings: '/user-courses-bindings'
}

export const jsonBodyMiddleware = express.json();

app.use(jsonBodyMiddleware);

app.use(RouterPaths.courses, getCoursesRouter(db))
app.use(RouterPaths.users, getUsersRouter(db))
app.use(RouterPaths.__test__, getTestRouter(db))
app.use(RouterPaths.userCoursesBindings, usersCoursesBindingsRouter(db))

