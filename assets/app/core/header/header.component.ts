
import { Component, OnInit } from '@angular/core';
import { Router } from "@angular/router";

@Component({
    selector: 'app-header',
    templateUrl: './header.component.html',
    styles:[`
        li {
            padding: 5px;
        }
    `]
})

export class HeaderComponent implements OnInit {
    constructor() { }

    ngOnInit() { }

}