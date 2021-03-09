import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

import { AppComponent } from './app.component';
import { RuntimeComponentCreatorModule } from 'projects/ng-runtime-component-creator/src/public-api';

@NgModule({
    declarations: [AppComponent],
    imports: [BrowserModule, RuntimeComponentCreatorModule],
    providers: [],
    bootstrap: [AppComponent],
})
export class AppModule {}
