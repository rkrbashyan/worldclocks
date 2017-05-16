import { Clock } from './clock.model';
import { FormGroup, FormControl, Validators } from '@angular/forms';

import { Zone } from './zone.model';
import { Router, ActivatedRoute } from '@angular/router';
import { Error } from '../errors/error.model';
import { Component, OnInit, HostBinding } from '@angular/core';
import { ClockService } from "./clock.service";

@Component({
    selector: 'app-create-clock',
    templateUrl: 'clock-create.component.html',
    styles: [
        `
    :host { 
        position: fixed; 
        display: block;
        top: 0px; 
        left: 0px; 
        bottom: 0px; 
        right: 0px; 
    }

    .backdrop {
            background-color: rgba(0,0,0,0.6);
            position: fixed;
            top: 0;
            left: 0;
            width: 100%;
            height: 100vh;
        }
    `
    ]
})

export class ClockCreateComponent implements OnInit {

    isEdit: boolean = false;
    idClock: number;
    myForm: FormGroup;

    timeZones: Zone[] = [];
    clock: Clock;

    descrRegex = /^[ a-zA-Z0-9\n\r]+$/;

    constructor(
        private router: Router,
        private route: ActivatedRoute,
        private clockService: ClockService) { }

    ngOnInit() {
        this.clockService.getTimeZones().subscribe(
            (timeZones: Zone[]) => {
                this.timeZones = timeZones;
            },
            (error) => {
                let err = new Error(error.title, error.error.message);
                this.router.navigate(
                    [{ outlets: { 'errorHandler': ['error', err], 'popup': null } }],
                    { queryParamsHandling: "preserve" });
            }
        );

        this.myForm = new FormGroup({
            timezone: new FormControl('', Validators.required),
            description: new FormControl('', [
                Validators.required,
                Validators.pattern(this.descrRegex),
                Validators.maxLength(120)
            ])
        });

        this.route.params.subscribe(
            params => {
                if (params['id']) {
                    // edit mode
                    this.isEdit = true;
                    this.idClock = +params['id'];
                    this.clock = this.clockService.getClockById(this.idClock);
                    this.myForm.controls['timezone'].setValue(this.clock.timezone);
                    this.myForm.controls['description'].setValue(this.clock.description);
                } else {
                    // create mode
                    this.isEdit = false;
                    this.idClock = null;
                    this.clock = null;
                }
            }
        );
    }

    onCancel() {
        this.closePopup();
    }

    onSave() {
        if (!this.isEdit) {
            // create new clock: POST
            this.clockService.addClock(
                this.myForm.controls['timezone'].value,
                this.myForm.controls['description'].value)
                .subscribe(
                (result: Clock) => { 
                    //console.log('Added: ', result); 
                    this.closePopup(); },
                (error) => {
                    let err = new Error(error.title, error.error.message);
                    this.router.navigate(
                        [{ outlets: { 'errorHandler': ['error', err], 'popup': null } }],
                        { queryParamsHandling: "preserve" });
                }
                );
        } else {
            // edit clock: PUT
            if (this.clock.description == this.myForm.controls['description'].value &&
                this.clock.timezone == this.myForm.controls['timezone'].value) {
                // nothing's changed
                this.closePopup();
            } else {
                this.clockService.updateClock(this.clock,
                    this.myForm.controls['timezone'].value,
                    this.myForm.controls['description'].value)
                    .subscribe(
                    (result: Clock) => { 
                        //console.log('Updated: ', result); 
                        this.closePopup(); },
                    (error) => {
                        let err = new Error(error.title, error.error.message);
                        this.router.navigate(
                            [{ outlets: { 'errorHandler': ['error', err], 'popup': null } }],
                            { queryParamsHandling: "preserve" });
                    }
                    );
            }
        }
    }

    onDelete() {
        this.clockService.deleteClock(this.clock)
            .subscribe(
            (result: Clock) => { 
                //console.log('Deleted: ', result); 
                this.closePopup(); },
            (error) => {
                let err = new Error(error.title, error.error.message);
                this.router.navigate(
                    [{ outlets: { 'errorHandler': ['error', err], 'popup': null } }],
                    { queryParamsHandling: "preserve" });
            }
            );
    }

    closePopup() {
        this.router.navigate([{ outlets: { popup: null } }], { queryParamsHandling: 'preserve' });
    }

}

