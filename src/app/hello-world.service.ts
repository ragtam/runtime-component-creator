import { Injectable } from '@angular/core';

@Injectable({
    providedIn: 'root',
})
export class HelloWorldService {
    constructor() {
        console.log('HelloService created');
    }

    public sayHello(name: string): void {
        console.log(`${name}, hello from HelloService`);
    }
}
