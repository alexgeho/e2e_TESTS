import request from 'supertest';
import {app, RouterPaths} from "../../src/app";
import {HTTP_STATUSES} from "../../src/utils";
import {CreateUserModel} from "../../src/features/users/models/CreateUserModel";

const getRequest = () => {
    return request(app)
}

describe('tests for /users', () => {

    beforeEach(async () => {
        await request(app).delete('/__test__/data')
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


        await request(app)
            .post(RouterPaths.users)
            .send({userName: ''})
            .expect(HTTP_STATUSES.BAD_REQUEST_400)

        await request(app)
            .get(RouterPaths.users)
            .expect(HTTP_STATUSES.OK_200, [])

    })

    let createdEntity1:any = null;

    it('should create entity with correct input data', async () => {
        const createResponse = await request(app)
            .post(RouterPaths.users)
            .send({userName: 'NewTitle'})
            .expect(HTTP_STATUSES.CREATED_201)

        createdEntity1 = createResponse.body;
        console.log('createdEntity1:', createdEntity1); // <-- Добавь сюда

        expect(createdEntity1).toEqual({
            id: expect.any(Number),
            userName: 'NewTitle'
        })

        await request(app)
            .get(RouterPaths.users)
            .expect(HTTP_STATUSES.OK_200, [createdEntity1])})

    let createdEntity2:any = null;

    it('create one more entity', async () => {

        const createResponse1 = await request(app)
            .post(RouterPaths.users)
            .send({userName: 'NewTitle'})
            .expect(HTTP_STATUSES.CREATED_201);
        const createdEntity1 = createResponse1.body;

        const createResponse = await request(app)
            .post(RouterPaths.users)
            .send({userName: 'it-incubator cc2'})
            .expect(HTTP_STATUSES.CREATED_201)

        createdEntity2 = createResponse.body;

        expect(createdEntity2).toEqual({
            id: expect.any(Number),
            userName: 'it-incubator cc2'
        })

        await request(app)
            .get(RouterPaths.users)
            .expect(HTTP_STATUSES.OK_200, [createdEntity1, createdEntity2])
    })



    it('should NOT update entity with incorrect input data', async () => {

        const createResponse = await request(app)
            .post(RouterPaths.users)
            .send({userName: 'it-incubator cc2'})
            .expect(HTTP_STATUSES.CREATED_201)

        createdEntity1 = createResponse.body;

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
            .put(`${RouterPaths.users}/${ - 100}`)
            .send({userName: 'good title'})
            .expect(HTTP_STATUSES.NOT_FOUND_404)
    })


    let createdEntity3:any = null;

    it('should update entity with correct input data', async () => {
        const createResponse = await request(app)
            .post(RouterPaths.users)
            .send({title: 'good title3'})
            .expect(HTTP_STATUSES.CREATED_201);

        createdEntity3 = createResponse.body;

        await request(app)
            .put(`${RouterPaths.users}/${createdEntity3.id}`)
            .send({title: 'good new title'})
            .expect(HTTP_STATUSES.NO_CONTENT_204);

        await request(app)
            .get(`${RouterPaths.users}/${createdEntity3.id}`)
            .expect(HTTP_STATUSES.OK_200, {
                id: createdEntity3.id,
                title: 'good new title'
            });
    });


    let createdCourse5:any = null;
    let createdCourse4:any = null;


    it('should delete both courses', async () => {

        const createResponse = await request(app)
            .post(RouterPaths.users)
            .send({title: 'NewTitle'})
            .expect(HTTP_STATUSES.CREATED_201)

        createdCourse5 = createResponse.body;

        const createResponse2 = await request(app)
            .post(RouterPaths.users)
            .send({title: 'it-incubator cc2'})
            .expect(HTTP_STATUSES.CREATED_201)

        createdCourse4 = createResponse2.body;

        await request(app)
            .delete(`${RouterPaths.users}/${createdCourse5.id}`)
            .expect(HTTP_STATUSES.NO_CONTENT_204)

        await request(app)
            .get(`${RouterPaths.users}/${createdCourse5.id}`)
            .expect(HTTP_STATUSES.NOT_FOUND_404)

        await request(app)
            .delete(`${RouterPaths.users}/${createdCourse4.id}`)
            .expect(HTTP_STATUSES.NO_CONTENT_204)

        await request(app)
            .get(`${RouterPaths.users}/${createdCourse4.id}`)
            .expect(HTTP_STATUSES.NOT_FOUND_404)

        await request(app)
            .get(RouterPaths.users)
            .expect(HTTP_STATUSES.OK_200, [])

    })




})
//it-incubator course