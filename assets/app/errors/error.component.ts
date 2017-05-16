import { Router, ActivatedRoute } from '@angular/router';

import { Component, OnInit } from '@angular/core';
import { Error } from './error.model';


@Component({
    selector: 'app-error',
    templateUrl: './error.component.html',
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

export class ErrorComponent implements OnInit {
    error: Error;

    constructor(private router: Router, private route: ActivatedRoute) { 

    }

    ngOnInit() {
        this.error = new Error(
            this.route.snapshot.paramMap.get('title'),
            this.route.snapshot.paramMap.get('message'));
    }

    onErrorHandled() {
        this.router.navigate([{ outlets: { 'errorHandler': null } }], { queryParamsHandling: 'preserve' });
    }
}