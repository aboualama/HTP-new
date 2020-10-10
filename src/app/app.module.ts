import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { RouteReuseStrategy } from '@angular/router';

import { IonicModule, IonicRouteStrategy } from '@ionic/angular';
import { SplashScreen } from '@ionic-native/splash-screen/ngx';
import { StatusBar } from '@ionic-native/status-bar/ngx';

import { AppComponent } from './app.component';
import { AppRoutingModule } from './app-routing.module';
import { ServiceWorkerModule } from '@angular/service-worker';
import { environment } from '../environments/environment'; 


import {IonicStorageModule} from '@ionic/storage';
import {HttpClient, HttpClientModule} from '@angular/common/http';
import {EnvService} from './pages/service/env.service';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';
import {ApiService} from './pages/service/api.service';
import {AuthGuard} from './pages/service/guard/auth.guard';
import {VideoPlayer} from '@ionic-native/video-player/ngx';
import {ScreenOrientation} from '@ionic-native/screen-orientation/ngx';
import { TranslateModule, TranslateLoader } from '@ngx-translate/core';
import {TranslateHttpLoader} from '@ngx-translate/http-loader';
import {NativeAudio} from "@ionic-native/native-audio/ngx";


@NgModule({
  declarations: [AppComponent],
  entryComponents: [],
  imports: [
    BrowserModule, 
    IonicModule.forRoot(), 
    AppRoutingModule, 
    ServiceWorkerModule.register('ngsw-worker.js', { enabled: environment.production }),
  
  
    HttpClientModule,
    IonicStorageModule.forRoot(),
    ReactiveFormsModule,
    FormsModule,
    TranslateModule.forRoot({
        defaultLanguage: localStorage.getItem('lang'),
        loader: {
            provide: TranslateLoader,
            useFactory: (createTranslateLoader),
            deps: [HttpClient]
        }
    }),
  
  ],
  providers: [
    StatusBar,
    SplashScreen,
    { provide: RouteReuseStrategy, useClass: IonicRouteStrategy }, 
    EnvService, ApiService, AuthGuard, ScreenOrientation,
    VideoPlayer,
    NativeAudio, 
  ],
  bootstrap: [AppComponent]
})
export class AppModule {}


export function createTranslateLoader(http: HttpClient) {
  return new TranslateHttpLoader(http, './assets/i18n/', '.json');
}