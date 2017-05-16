
import { Pipe, PipeTransform } from '@angular/core';
import { Clock } from "./clock.model";

@Pipe({
    name: 'sort',
    pure: false
})

export class ClockSortPipe implements PipeTransform {
    transform(clocks: Clock[], sortBy: string): Clock[] {
        return clocks.sort((a, b) => {
            var _a = a[sortBy].toUpperCase();
            var _b = b[sortBy].toUpperCase();

            if ( _a < _b ) {
                return -1;
            }
            if ( _a > _b) {
                return 1;
            }
            return 0;
        });
    }
}