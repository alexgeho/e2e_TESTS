import {app, RouterPaths} from "../../../src/app";
import {HTTP_STATUSES, HttpStatusType} from "../../../src/utils";
import request from 'supertest';
import {
    CreateUserCourseBindingModel
} from "../../../src/features/users-courses-bindings/models/CreateUserCourseBindingModel";


export const usersCoursesBindingsTestManager = {
    async createBinding(
        data: CreateUserCourseBindingModel,
        expectedStatusCode: HttpStatusType = HTTP_STATUSES.CREATED_201,
        expectedEntity?: any // <--- добавляем!
    ) {
        const response = await request(app)
            .post(RouterPaths.userCoursesBindings)
            .send(data)
            .expect(expectedStatusCode);

        let createdEntity;
        if (expectedStatusCode === HTTP_STATUSES.CREATED_201) {
            createdEntity = response.body;

            if (expectedEntity) {
                expect(createdEntity).toEqual(expectedEntity);
            } else {
                expect(createdEntity).toEqual({
                    userId: data.userId,
                    courseId: data.courseId,
                    date: expect.any(String),
                });
            }
        }
        return { response, createdEntity };
    }
}


// export type CreateUserManagerOptions = {
//     statusCode: keyof typeof HTTP_STATUSES
// }
