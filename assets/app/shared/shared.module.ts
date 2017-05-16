import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { DropDownDirective } from "./dropdown.directive";



@NgModule({
    declarations: [
        DropDownDirective
        ],
    imports: [],
    exports: [
        CommonModule,
        DropDownDirective
    ],
    providers: []
})
export class SharedModule { }
