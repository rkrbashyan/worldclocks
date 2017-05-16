import { ReactiveFormsModule } from '@angular/forms';

import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { ClocksComponent } from "./clocks.component";
import { ClockComponent } from "./clock.component";
import { ClockService } from "./clock.service";
import { ClockSortPipe } from "./sort.pipe";
import { ClockCreateComponent } from "./clock-create.component";

@NgModule({
    declarations: [
        ClocksComponent,
        ClockComponent,
        ClockSortPipe,
        ClockCreateComponent
    ],
    imports: [ 
        CommonModule,
        ReactiveFormsModule
        ],
    providers: [ClockService]
})
export class ClockModule {}