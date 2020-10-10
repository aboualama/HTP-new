import {Injectable} from '@angular/core';
import {HttpHeaders} from '@angular/common/http';

@Injectable({
    providedIn: 'root'
})
export class EnvService {
    //API_URL = 'https://dev.hpt.training/api/v1.1/';
    API_URL = 'https://dev.hpt.training/api/v1.1/';
   // API_URL = 'http://127.0.0.1:8000/api/v1.1/';
    //API_URL = 'http://hpt.test/api/v1.1/';
    options = {
        headers: new HttpHeaders({
            //    'Accept': 'application/json',
            'Content-Type': 'application/json',
            //  'X-Requested-With': 'XMLHttpRequest',
            //  'Access-Control-Allow-Origin': '*',
            // 'Access-Control-Allow-Methods': ' GET, POST, PATCH, PUT, DELETE, OPTIONS',
            // 'Access-Control-Allow-Headers': '*',
        }),
    };

    constructor() {
    }
}
