import Server from './server';

//creates a route for the homePage
Server.getRouter().get('/', ( request, response) => {
    response.sendFile('public/index.html', {root: __dirname});
});
