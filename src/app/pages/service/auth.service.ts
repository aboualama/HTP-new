import {HttpClient} from '@angular/common/http';
import {Injectable} from '@angular/core';
import {tap} from 'rxjs/operators';
import {EnvService} from '../service/env.service';
import {Storage} from '@ionic/storage';
import {Router} from '@angular/router';
import {ToastController} from '@ionic/angular';

@Injectable({
    providedIn: 'root'
})

export class AuthService {
    isLoggedIn = false;
    token: any;

    constructor(private http: HttpClient, private storage: Storage, private env: EnvService, public router: Router, private toastController: ToastController) {
    }

    login(credentials) {
        return this.http.post(this.env.API_URL + 'auth/login', JSON.stringify(credentials), this.env.options).pipe(
            tap((data: any) => {
                if (data.status != "200") {
                    if (status =="401"){
                        this.toast("account, non verificato. Clicca sul link ricevuto via mail");
                        return null;
                    }
                    this.toast('Username o password errate!');
                }
                this.storage.set('data', data)
                    .then(
                        () => {
                            console.log('data Stored');
                        },
                        error => console.error('Error storing item', error)
                    );
                this.token = data.access_token;
                this.isLoggedIn = true;
                return data;
            }),
        );
    }


        register(credentials) {

        console.log('credentials', credentials);
        return this.http.post(this.env.API_URL + 'auth/register', JSON.stringify(credentials), this.env.options)
            .pipe(
                tap((data: any) => {

                    if (data.status) {
                        this.toast(data.errors[Object.keys(data.errors)[0]]);
                        return;
                    }
                    console.log(data)
                    if (data.access_token) {


                        this.storage.set('token', data.access_token)
                            .then(
                                () => {
                             //       this.router.navigateByUrl('login');
                                },
                                error => console.error('Error storing item', error)
                            );
                        this.isLoggedIn = false;
                        this.token = data.access_token;
                        return data;
                    }
                    return data;
                })
            );
    }


    logout() {
        localStorage.removeItem('token');
        this.storage.remove('token');
        this.isLoggedIn = false;
        delete this.token;
        this.router.navigateByUrl('/');
        return this.http.get(this.env.API_URL + 'auth/logout', this.env.options)
            .pipe(
                tap(token => {
                })
            );
    }

    getToken() {
        return this.storage.get('token').then(
            data => {
                this.token = data;
                if (this.token != null) {
                    this.isLoggedIn = true;
                } else {
                    this.isLoggedIn = false;
                }
            },
            error => {
                this.token = null;
                this.isLoggedIn = false;
            }
        );
    }


    checklicens(body) {
        return this.http.post(this.env.API_URL + 'checklicens', JSON.stringify(body), this.env.options).pipe(
            tap((data: any) => {
                this.storage.set('token', data)
                    .then(
                        () => {
                            if (data.status == 200) {
                                localStorage.setItem('token', JSON.stringify(data.access_token));
                                localStorage.setItem('licens_id', data.licens_id);
                                console.log(data.licens_id);
                                this.router.navigateByUrl('/questions');
                            } else {
                                this.toast('Licenza non valida');

                            }
                        },
                    );
                return data;
            }),
        );
    }

    private async toast(msg) {
        const t = await this.toastController.create({message: msg, color: 'danger', duration: 2000});
        t.present();
    }
}
