import request from 'supertest';
import {app, RouterPaths} from "../../src/app";
import {HTTP_STATUSES} from "../../src/utils";
//import { db } from '../../src/index';

describe('/course', () => {

    beforeEach(async () => {
        await request(app).delete('/__test__/data')
    })


    it('should return 200 and empty array', async () => {
        await request(app)
            .get(RouterPaths.courses)
            .expect(HTTP_STATUSES.OK_200, [])
    })

    it('should return 404 for not existing course', async () => {
        await request(app)
            .get(`${RouterPaths.courses}/1`)
            .expect(HTTP_STATUSES.NOT_FOUND_404)
    })

    it('should NOT create course with incorrect input data', async () => {
        await request(app)
            .post(RouterPaths.courses)
            .send({title: ''})
            .expect(HTTP_STATUSES.BAD_REQUEST_400)

        await request(app)
            .get(RouterPaths.courses)
            .expect(HTTP_STATUSES.OK_200, [])

    })

    let createdCourse1:any = null;

    it('should create course with correct input data', async () => {
        const createResponse = await request(app)
            .post(RouterPaths.courses)
            .send({title: 'NewTitle'})
            .expect(HTTP_STATUSES.CREATED_201)

         createdCourse1 = createResponse.body;

        console.log('createdCourse1:', createdCourse1); // <-- Добавь сюда

        expect(createdCourse1).toEqual({
            id: expect.any(Number),
            title: 'NewTitle'
        })

        await request(app)
            .get(RouterPaths.courses)
            .expect(HTTP_STATUSES.OK_200, [createdCourse1])})

    let createdCourse2:any = null;

    it('create one more course', async () => {

        const createResponse1 = await request(app)
            .post(RouterPaths.courses)
            .send({title: 'NewTitle'})
            .expect(HTTP_STATUSES.CREATED_201);
        const createdCourse1 = createResponse1.body;

        const createResponse = await request(app)
            .post(RouterPaths.courses)
            .send({title: 'it-incubator cc2'})
            .expect(HTTP_STATUSES.CREATED_201)

        createdCourse2 = createResponse.body;

        expect(createdCourse2).toEqual({
            id: expect.any(Number),
            title: 'it-incubator cc2'
        })

        await request(app)
            .get(RouterPaths.courses)
            .expect(HTTP_STATUSES.OK_200, [createdCourse1, createdCourse2])
    })



    it('should NOT update course with incorrect input data', async () => {

        const createResponse = await request(app)
            .post(RouterPaths.courses)
            .send({title: 'it-incubator cc2'})
            .expect(HTTP_STATUSES.CREATED_201)

        createdCourse1 = createResponse.body;

        await request(app)
            .put(`${RouterPaths.courses}/${createdCourse1.id}`)
            .send({title: ''})
            .expect(HTTP_STATUSES.BAD_REQUEST_400)

        await request(app)
            .get(`${RouterPaths.courses}/${createdCourse1.id}`)
            .expect(HTTP_STATUSES.OK_200, createdCourse1)
    })

    it('should NOT update course that not exist', async () => {
        await request(app)
            .put(`${RouterPaths.courses}/${-100}`)
            .send({title: 'good title'})
            .expect(HTTP_STATUSES.NOT_FOUND_404)
    })


    let createdCourse3:any = null;

    it('should update course with correct input data', async () => {
        const createResponse = await request(app)
            .post(RouterPaths.courses)
            .send({title: 'good title3'})
            .expect(HTTP_STATUSES.CREATED_201);

        createdCourse3 = createResponse.body;

        await request(app)
            .put(`${RouterPaths.courses}/${createdCourse3.id}`)
            .send({title: 'good new title'})
            .expect(HTTP_STATUSES.OK_200);

        await request(app)
            .get(`${RouterPaths.courses}/${createdCourse3.id}`)
            .expect(HTTP_STATUSES.OK_200, {
                id: createdCourse3.id,
                title: 'good new title'
            });
    });


    let createdCourse5:any = null;
    let createdCourse4:any = null;


    it('should delete both courses', async () => {

        const createResponse = await request(app)
            .post(RouterPaths.courses)
            .send({title: 'NewTitle'})
            .expect(HTTP_STATUSES.CREATED_201)

        createdCourse5 = createResponse.body;

        const createResponse2 = await request(app)
            .post(RouterPaths.courses)
            .send({title: 'it-incubator cc2'})
            .expect(HTTP_STATUSES.CREATED_201)

        createdCourse4 = createResponse2.body;

        await request(app)
            .delete(`${RouterPaths.courses}/${createdCourse5.id}`)
            .expect(HTTP_STATUSES.NO_CONTENT_204)

        await request(app)
            .get(`${RouterPaths.courses}/${createdCourse5.id}`)
            .expect(HTTP_STATUSES.NOT_FOUND_404)

        await request(app)
            .delete(`${RouterPaths.courses}/${createdCourse4.id}`)
            .expect(HTTP_STATUSES.NO_CONTENT_204)

        await request(app)
            .get(`${RouterPaths.courses}/${createdCourse4.id}`)
            .expect(HTTP_STATUSES.NOT_FOUND_404)

        await request(app)
            .get('/courses')
            .expect(HTTP_STATUSES.OK_200, [])

    })




})
//it-incubator course