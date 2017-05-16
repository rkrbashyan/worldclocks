export class Clock {
    constructor(
        public id: number,
        public timezone: string,
        public description: string,
        public gmtOffset: number
    ) {}
}