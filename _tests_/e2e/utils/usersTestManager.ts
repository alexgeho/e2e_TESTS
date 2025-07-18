import {app, RouterPaths} from "../../../src/app";
import {HTTP_STATUSES} from "../../../src/utils";
import request from 'supertest';
import {CreateUserModel} from "../../../src/features/users/models/CreateUserModel";

export const usersTestManager = {
async createUser (data:CreateUserModel) {
    const response = await request(app)
        .post(RouterPaths.users)
        .send(data)
        .expect(HTTP_STATUSES.CREATED_201)

    return response;
}
}