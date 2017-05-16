import { Router, ActivatedRoute } from '@angular/router';
import { Subscription, Observable } from 'rxjs/Rx';

import { Component, OnInit, Input, OnDestroy } from '@angular/core';
import { Clock } from "./clock.model";
import { ClockService } from "./clock.service";

@Component({
    selector: 'app-clock',
    templateUrl: './clock.component.html',
    styleUrls: ['./clock.component.css']
})

export class ClockComponent implements OnInit, OnDestroy {

    time: string;
    timeSubscription: Subscription;

    @Input() clock: Clock;

    constructor(private clockService: ClockService,
        private router: Router,
        private route: ActivatedRoute) { }

    ngOnInit() {
        //set start time to avoid blicking
        this.setClockTime(new Date());

        this.timeSubscription = this.clockService.timer.subscribe(
            (dt) => {
                let date = new Date(dt);
                this.setClockTime(date);
            }
        );
    }

    setClockTime(date) {
        date.setUTCSeconds(date.getUTCSeconds() + this.clock.gmtOffset);

        const h = date.getUTCHours();
        const m = date.getUTCMinutes();
        const s = date.getUTCSeconds();

        this.time = (h < 10 ? '0' : '') + h + ':'
            + (m < 10 ? '0' : '') + m + ':'
            + (s < 10 ? '0' : '') + s;
    }

    onClick() {
        this.router.navigate(
            [{ outlets: { popup: ['update', this.clock.id] } }],
            { queryParamsHandling: "preserve" });
    }

    ngOnDestroy() {
        this.timeSubscription.unsubscribe();
    }

}