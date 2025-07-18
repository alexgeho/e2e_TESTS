import request from 'supertest';
import {app, RouterPaths} from "../../src/app";
import {HTTP_STATUSES} from "../../src/utils";
import {usersTestManager} from "./utils/usersTestManager";
import {CreateUserModel} from "../../src/features/users/models/CreateUserModel";

const getRequest = () => {
    return request(app)
}

describe('tests for /users', () => {
    // let server: Server

    beforeEach(async () => {

        // server = app.listen(3000);
        // supertest.agent(server)

        await getRequest().delete(`${RouterPaths.__test__}/data`)
    })

    it('should return 200 and empty array', async () => {
        await request(app)
            .get(RouterPaths.users)
            .expect(HTTP_STATUSES.OK_200, [])
    })

    it('should return 404 for not existing entity', async () => {
        await request(app)
            .get(`${RouterPaths.users}/1`)
            .expect(HTTP_STATUSES.NOT_FOUND_404)
    })

    it('should NOT create course with incorrect input data', async () => {
        const data: CreateUserModel = {userName: ''}

        await usersTestManager.createUser(data, HTTP_STATUSES.BAD_REQUEST_400)

        await request(app)
            .get(RouterPaths.users)
            .expect(HTTP_STATUSES.OK_200, [])

    })

    let createdEntity1: any = null;
    const data: CreateUserModel = {userName: 'dimych'}


    it('should create entity with correct input data', async () => {

        const data: CreateUserModel = {userName: 'dimych'}
        const {createdEntity} = await usersTestManager.createUser(data)

        createdEntity1 = createdEntity;

        await request(app)
            .get(RouterPaths.users)
            .expect(HTTP_STATUSES.OK_200, [createdEntity1])
    })

    let createdEntity2: any = null;

    it('create one more entity', async () => {

        const {createdEntity} = await usersTestManager.createUser(data)

        const createdEntity1 = createdEntity;

        createdEntity2 = createdEntity;

        expect(createdEntity2).toEqual({
            id: expect.any(Number),
            userName: 'dimych'
        })

        await request(app)
            .get(RouterPaths.users)
            .expect(HTTP_STATUSES.OK_200, [createdEntity1])
    })

    it('should NOT update entity with incorrect input data', async () => {

        const {createdEntity} = await usersTestManager.createUser(data)

        createdEntity1 = createdEntity;

        await request(app)
            .put(`${RouterPaths.users}/${createdEntity1.id}`)
            .send({userName: ''})
            .expect(HTTP_STATUSES.BAD_REQUEST_400)

        await request(app)
            .get(`${RouterPaths.users}/${createdEntity1.id}`)
            .expect(HTTP_STATUSES.OK_200, createdEntity1)
    })

    it('should NOT update entity that not exist', async () => {
        await request(app)
            .put(`${RouterPaths.users}/${-100}`)
            .send({userName: 'good title'})
            .expect(HTTP_STATUSES.NOT_FOUND_404)
    })

    let createdEntity3: any = null;

    it('should update entity with correct input data', async () => {
        const data2 = {userName: 'good title3'}
        const {createdEntity} = await usersTestManager.createUser(data2)

        createdEntity3 = createdEntity;

        await request(app)
            .put(`${RouterPaths.users}/${createdEntity3.id}`)
            .send({userName: 'good new title'})
            .expect(HTTP_STATUSES.NO_CONTENT_204);

        await request(app)
            .get(`${RouterPaths.users}/${createdEntity3.id}`)
            .expect(HTTP_STATUSES.OK_200, {
                id: createdEntity3.id,
                userName: 'good new title'
            });
    });

    let data1: CreateUserModel = {userName: 'good new title'};
    let data2: CreateUserModel = {userName: 'good title'};
    let user1: any;
    let user2: any;


    it('should delete both courses', async () => {

        const {createdEntity: createdUser1} = await usersTestManager.createUser(data1)
        user1 = createdUser1;

        const {createdEntity: createdUser2} = await usersTestManager.createUser(data2)
        user2 = createdUser2;

        await request(app)
            .delete(`${RouterPaths.users}/${user1.id}`)
            .expect(HTTP_STATUSES.NO_CONTENT_204)

        await request(app)
            .get(`${RouterPaths.users}/${user1.id}`)
            .expect(HTTP_STATUSES.NOT_FOUND_404)

        await request(app)
            .delete(`${RouterPaths.users}/${user2.id}`)
            .expect(HTTP_STATUSES.NO_CONTENT_204)

        await request(app)
            .get(`${RouterPaths.users}/${user2.id}`)
            .expect(HTTP_STATUSES.NOT_FOUND_404)

        await request(app)
            .get(RouterPaths.users)
            .expect(HTTP_STATUSES.OK_200, [])

    })

})
