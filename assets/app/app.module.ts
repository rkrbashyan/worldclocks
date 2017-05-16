import { HttpModule } from '@angular/http';

import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppComponent } from "./app.component";
import { CoreModule } from "./core/core.module";
import { ClockModule } from "./clocks/clock.module";
import { ErrorComponent } from "./errors/error.component";


@NgModule({
    declarations: [
        AppComponent,
        ErrorComponent
        ],
    imports: [
        HttpModule,
        BrowserModule,
        CoreModule,
        ClockModule
        ],
    providers: [],
    bootstrap: [AppComponent]
})
export class AppModule {

}