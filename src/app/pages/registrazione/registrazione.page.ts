import {Component, OnInit} from '@angular/core';
import {AuthService} from '../service/auth.service';
// import { AppRoutingModule } from '../app-routing.module';
import {Router} from '@angular/router';

@Component({
    selector: 'app-registrazione',
    templateUrl: './registrazione.page.html',
    styleUrls: ['./registrazione.page.scss'],
})

export class RegistrazionePage implements OnInit {

    passwordType: string = 'password';
    passwordIcon: string = 'eye-off';

    hideShowPassword() {
        this.passwordType = this.passwordType === 'text' ? 'password' : 'text';
        this.passwordIcon = this.passwordIcon === 'eye-off' ? 'eye' : 'eye-off';
    }


    hideMe: boolean = true;
    showMe: boolean = false;

    showRegister= true;

    hide() {

        this.hideMe = this.hideMe === true ? false : true;
        this.showMe = this.showMe === false ? true : false;

    }

    restart() {

        this.hideMe = this.hideMe === false ? true : false;
        this.showMe = this.showMe === true ? false : true;

    }

    constructor(public authService: AuthService, public router: Router) {
    }

    ngOnInit() {
    }

    register(form) {
        console.log(form)
        let credentials = {
            name: form.value.name,
            password: form.value.password,
            password_confirmation: form.value.password_confirmation,
            email: form.value.email,
            userName: form.value.userName,
            displayName: form.value.displayName,
            referentName: form.value.referentName,
            referentNumber: form.value.referentNumber,
            cell: form.value.cell,
            cf: form.value.cf,
            address: form.value.address,
            role: form.value.role,
            lastName: form.value.lastName
        };
        console.log(credentials);
        this.authService.register(credentials).subscribe((res) => {
            console.log(res);
            if (res.access_token){
                this.showRegister = false;
            }
        });
    }

}
