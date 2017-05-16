import SERVER_URL from '../server-url';

import { Http, Response, Headers } from '@angular/http';
import { Injectable } from '@angular/core';

import { Zone } from './zone.model';
import { Clock } from "./clock.model";

import 'rxjs/Rx';
import { Observable } from "rxjs/Observable";
import { Subject } from 'rxjs/Subject';


@Injectable()
export class ClockService {

    private clocks: Clock[] = [];
    private timeZones: Zone[] = [];
    public timer = new Subject<any>();

    constructor(private http: Http) {
        setInterval(() => this.timer.next(Date.now()), 1000);
    }

    getClockById(id: number): Clock {
        for (let i = 0; i < this.clocks.length; i++) {
            if (this.clocks[i].id === id) return this.clocks[i];
        }
        return null;
    }

    getClocks() {
        return this.http.get(SERVER_URL + '/api/clocks')
            .map((response: Response) => {
                this.clocks = response.json().obj;
                return this.clocks;
            })
            .catch((error: Response) => {
                return Observable.throw(error.json())
            });
    }

    getTimeZones() {
        if (this.timeZones.length === 0) {
            // go grab timezones
            return this.http.get(SERVER_URL + '/api/timezones')
                .map((response: Response) => {
                    this.timeZones = response.json().obj;
                    this.timeZones.sort((a, b) => {
                        var _a = a['timezone'].toUpperCase();
                        var _b = b['timezone'].toUpperCase();

                        if (_a < _b) {
                            return -1;
                        }
                        if (_a > _b) {
                            return 1;
                        }
                        return 0;
                    });
                    return this.timeZones;
                })
                .catch((error: Response) => {
                    return Observable.throw(error.json())
                });
        } else {
            // use cached
            return Observable.of(this.timeZones);
        }
    }

    addClock(timezone: string, description: string): Observable<any> {
        const newClock = {
            "timezone": timezone,
            "description": description
        };

        const body = JSON.stringify(newClock);
        const headers = new Headers({ 'Content-Type': 'application/json' });

        return this.http.post(SERVER_URL + '/api/clock', body, { headers: headers })
            .map((response: Response) => {
                const result = response.json();
                const clock = new Clock(result.obj.id,
                    result.obj.timezone,
                    result.obj.description,
                    result.obj.gmtOffset);
                this.clocks.push(clock);
                return clock;
            })
            .catch((error: Response) => {
                return Observable.throw(error.json())
            });
    }

    deleteClock(clock: Clock) {
        return this.http.delete(SERVER_URL + '/api/clock/' + clock.id)
            .map(
            (response: Response) => {
                const result = response.json();
                this.clocks.splice(this.clocks.indexOf(clock), 1);
                return clock;
            })
            .catch((error: Response) => {
                return Observable.throw(error.json())
            });
    }

    updateClock(clock: Clock, timezone: string, description: string) {
        const newClock = {
            "timezone": timezone,
            "description": description
        };

        const body = JSON.stringify(newClock);
        const headers = new Headers({ 'Content-Type': 'application/json' });

        return this.http.put(SERVER_URL + '/api/clock/' + clock.id, body, { headers: headers })
            .map((response: Response) => {
                const result = response.json();
                const updatedClock = new Clock(result.obj.id,
                    result.obj.timezone,
                    result.obj.description,
                    result.obj.gmtOffset);
                this.clocks[this.clocks.indexOf(clock)] = updatedClock;
                return clock;
            })
            .catch((error: Response) => {
                return Observable.throw(error.json())
            });
    }

}
