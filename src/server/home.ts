import Server from './server';

class HomePage {

    public serialize(): string {
        return 'Hello World';
    }
}

Server.getRouter().get('/', ( request, response) => {
    let homePage = new HomePage();
    response.sendFile('public/index.html', {root: __dirname});
});
