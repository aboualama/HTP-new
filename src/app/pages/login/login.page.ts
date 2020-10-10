import {Component, OnInit} from '@angular/core';
import {AlertController, NavController} from '@ionic/angular';
import {AuthService} from '../service/auth.service';
import {Router} from '@angular/router';
import {BehaviorSubject} from 'rxjs';
import {Storage} from '@ionic/storage';
import {TranslateService} from "@ngx-translate/core";

@Component({
    selector: 'app-login',
    templateUrl: './login.page.html',
    styleUrls: ['./login.page.scss'],
})

export class LoginPage implements OnInit {

    constructor(private navCtrl: NavController, public alertController: AlertController, public authService: AuthService, public router: Router, private storage: Storage,
                private translateServicce: TranslateService) {

    }

    passwordType = 'password';
    passwordIcon = 'eye-off';


    authState = new BehaviorSubject(false);
    lang: any;

    hideShowPassword() {
        this.passwordType = this.passwordType === 'text' ? 'password' : 'text';
        this.passwordIcon = this.passwordIcon === 'eye-off' ? 'eye' : 'eye-off';
    }

    async presentAlertMultipleButtons() {
        return this.navigate('/registrazione');
        const alert = await this.alertController.create({
            cssClass: 'my-custom-class --height',
            header: 'Registrazione:',
            subHeader: 'Seleziona il tipo di utente che desideri creare.',
            buttons: [
                {
                    text: 'Utente Semplice',
                    role: 'string',
                    cssClass: 'my-custom-class',
                    handler: () => {
                        this.navigate('/registrazione-utente');
                    }
                },
                {
                    text: 'Rivenditore',
                    role: 'string',
                    cssClass: 'my-custom-class',
                    handler: () => {
                        this.navigate('/registrazione');
                    }
                }
            ]
        });

        await alert.present();
    }

    navigate(str: any) {
        this.navCtrl.navigateRoot(str);
    }

    ngOnInit() {

        this.lang = this.translateServicce.getDefaultLang() || this.translateServicce.getBrowserLang();
        this.selectlang(this.lang);
        console.log(this.lang);
    }

    login(form) {

        const credentials = {
            email: form.value.email,
            password: form.value.password,
        };

        this.authService.login(credentials).subscribe(
            (data: any) => {
                console.log(data);
                localStorage.clear();
                localStorage.setItem('user_id', JSON.stringify(data.user.id));
                localStorage.setItem('user_id', JSON.stringify(data['user']['id']));
                this.router.navigateByUrl('/licenza');
            });
    }


    ifLoggedIn() {
        this.storage.get('USER_INFO').then((response) => {
            if (response) {
                this.authState.next(true);
            }
        });
    }

    isAuthenticated() {
        return this.authState.value;
    }


    selectlang(lang) {
        console.log(lang);
        localStorage.setItem('lang', lang);
        this.translateServicce.setDefaultLang(lang);
        this.translateServicce.resetLang(lang);

    }
}
