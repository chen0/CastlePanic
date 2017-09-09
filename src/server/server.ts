import * as express from 'express';
import * as path from 'path';

class Server {

    public static readonly port: number = 8000;

    private express: express.Application;
    private router: express.Router;

    constructor() {
        this.express = express();

        this.express.use('/', express.static( path.join(__dirname, '/public') ) );

        this.router = express.Router();
        this.express.use('/', this.router);
    }

    public getRouter(): express.Router {
        return this.router;
    }

    public start(): void {
        this.express.listen( Server.port, () => {
            console.info(`Server running at http://127.0.0.1:${Server.port}`);
        });
    }
}

export default new Server();
