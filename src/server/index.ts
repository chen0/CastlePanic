import {Api} from './api';
import './home';
import Server from './server';

let apiEndpoint = new Api();

Server.start();
