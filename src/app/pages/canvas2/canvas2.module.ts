import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { Canvas2PageRoutingModule } from './canvas2-routing.module';

import { Canvas2Page } from './canvas2.page';
import {TranslateModule} from "@ngx-translate/core";

@NgModule({
    imports: [
        CommonModule,
        FormsModule,
        IonicModule,
        Canvas2PageRoutingModule,
        TranslateModule
    ],
  declarations: [Canvas2Page]
})
export class Canvas2PageModule {}
