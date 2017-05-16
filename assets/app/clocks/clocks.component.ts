import { ActivatedRoute, Router } from '@angular/router';
import { Error } from '../errors/error.model';
import { Component, OnInit } from '@angular/core';
import { Clock } from "./clock.model";
import { ClockService } from "./clock.service";

@Component({
    selector: 'app-clocks',
    template:
    `
    <div class="row">
        <div class="col-sm-12">
            <app-clock 
                [clock]="clock" 
                *ngFor="let clock of clocks | sort:sortBy"
            ></app-clock>
        </div>
    </div>
    `
})

export class ClocksComponent implements OnInit {

    sortBy: string = 'timezone';
    clocks: Clock[] = [];

    constructor(private route: ActivatedRoute,
        private router: Router,
        private clockService: ClockService) { }

    ngOnInit() {
        this.clockService.getClocks().subscribe(
            (clocks: Clock[]) => this.clocks = clocks,
            (error) => {
                let err = new Error(error.title, error.error.message);
                this.router.navigate(
                    [{ outlets: { 'errorHandler': ['error', err], 'popup': null } }],
                    { queryParamsHandling: "preserve" });
            }
        );

        this.route.queryParams.subscribe(
            (queryParams) => {
                this.sortBy = queryParams['sort'];
            }
        );

    }
}

