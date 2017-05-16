
import { NgModule } from '@angular/core';
import { SharedModule } from "../shared/shared.module";
import { HeaderComponent } from "./header/header.component";
import { AppRoutingModule } from "../app-routing.module";


@NgModule({
    declarations: [
        HeaderComponent
        ],
    imports: [
        SharedModule,
        AppRoutingModule
        ],
    exports: [
        HeaderComponent,
        AppRoutingModule
        ],
    providers: [],
})
export class CoreModule { }
