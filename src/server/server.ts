import * as express from 'express';
import * as path from 'path';

/**
 * The Server object manages the express.js server. This server will serve all files in public/
 * 
 * @class Server
 */
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

    /**
     * Gets the express router from the server so that you can add new routes to the server.
     * 
     * @returns {express.Router} 
     * @memberof Server
     */
    public getRouter(): express.Router {
        return this.router;
    }

    /**
     * Starts the express server on port
     * 
     * @memberof Server
     */
    public start(): void {
        this.express.listen( Server.port, () => {
            console.info(`Server running at http://127.0.0.1:${Server.port}`);
        });
    }
}

export default new Server();
