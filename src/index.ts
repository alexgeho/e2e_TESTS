import express, {Request, Response} from 'express';

export const app = express();

const port = 3000;

export const HTTP_STATUSES = {
    OK_200: 200,
    CREATED_201: 201,
    NO_CONTENT_204: 204,
    BAD_REQUEST_400: 400,
    NOT_FOUND_404: 404,
};

const jsonBodyMiddleware = express.json();
app.use(jsonBodyMiddleware);

export const db = {
    courses: [
        {id: 1, title: 'front-end'},
        {id: 2, title: 'back-end'},
        {id: 3, title: 'automation qa'},
        {id: 4, title: 'devops'},
    ],
};

app.get('/courses', (req: Request, res: Response) => {
    let foundCourses = db.courses;

    res.json(foundCourses);
});

app.get('/courses/:id', (req: Request, res: Response) => {
    const foundCourse = db.courses.find(course =>course.id === +req.params.id);
if (!foundCourse) {
    return res.sendStatus(HTTP_STATUSES.NOT_FOUND_404);}

    res.json(foundCourse);


} )

app.post('/courses', (req: Request, res: Response) => {
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

app.delete('/courses/:id', (req: Request, res: Response) => {
    db.courses = db.courses.filter(c => c.id !== +req.params.id);
    res.sendStatus(HTTP_STATUSES.NO_CONTENT_204);
});

app.put('/courses/:id', (req: Request, res: Response) => {
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



app.delete('/__test__/data', (req: Request, res: Response) => {
    db.courses = [];
    res.sendStatus(HTTP_STATUSES.NO_CONTENT_204);
});


// Запускаем сервер только если не тесты
if (process.env.NODE_ENV !== 'test') {
    app.listen(port, () => {
        console.log(`Example app listening on port ${port}`);
    });
}
