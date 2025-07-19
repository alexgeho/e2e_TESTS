import request from 'supertest';
import {app, RouterPaths} from "../../src/app";
import {HTTP_STATUSES} from "../../src/utils";
import {usersCoursesBindingsTestManager} from "./utils/usersCoursesBindingsTestManager";
import {
    CreateUserCourseBindingModel
} from "../../src/features/users-courses-bindings/models/CreateUserCourseBindingModel";
import {usersTestManager} from "./utils/usersTestManager";
import {coursesTestManager} from "./utils/coursesTestManager";

describe('test for /user-courses-bindings', () => {

    beforeEach(async () => {
        await request(app).delete(`${RouterPaths.__test__}/data`)
    })


    it('should create entity with correct input data', async () => {

        const createdUserResult = await usersTestManager.createUser({userName: 'dimych'});
        const createdCourseResult = await coursesTestManager.createCourse({title: 'fullstack'});

        const data: CreateUserCourseBindingModel = {
            userId: createdUserResult.createdEntity.id,
            courseId: createdCourseResult.createdEntity.id
        };

        const expected = {
            userId: data.userId,
            courseId: data.courseId,
            date: expect.any(String),
            userName: createdUserResult.createdEntity.userName,
            title: createdCourseResult.createdEntity.title
        };

        await usersCoursesBindingsTestManager.createBinding(data, HTTP_STATUSES.CREATED_201, expected);

    })

    it(`shouldn't create courseBinding because courseBinding is already exist`, async () => {

        const createdUserResult = await usersTestManager.createUser({userName: 'dimych'});
        const createdCourseResult = await coursesTestManager.createCourse({title: 'fullstack'});

        const data: CreateUserCourseBindingModel = {
            userId: createdUserResult.createdEntity.id,
            courseId: createdCourseResult.createdEntity.id
        };

        const expected = {
            userId: data.userId,
            courseId: data.courseId,
            date: expect.any(String),
            userName: createdUserResult.createdEntity.userName,
            title: createdCourseResult.createdEntity.title
        };

        await usersCoursesBindingsTestManager.createBinding(data, HTTP_STATUSES.CREATED_201, expected);

        await usersCoursesBindingsTestManager.createBinding(data, HTTP_STATUSES.BAD_REQUEST_400);

})

})
//it-incubator course