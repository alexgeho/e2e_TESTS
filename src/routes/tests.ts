export const getTestsRouter = (db: DBType) => {
    const router: Router = express.Router();

    router.delete('/data', (req: Request, res: Response) => {
        db.courses = [];
        res.sendStatus(HTTP_STATUSES.NO_CONTENT_204);
    });

    return router;
}
