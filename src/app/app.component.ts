import { Component, OnInit } from '@angular/core';
import { ComponentMetadata } from 'projects/ng-runtime-component-creator/src/public-api';
import { HelloWorldService } from './hello-world.service';

@Component({
    selector: 'app-root',
    templateUrl: './app.component.html',
    styleUrls: ['./app.component.scss'],
})
export class AppComponent {
    constructor(private helloWorldService: HelloWorldService) {}

    public componentMetadata: ComponentMetadata = {
        component: getThisComponent(),
    };

    public onClick(): void {
        this.helloWorldService.sayHello('AppComponent');
    }
}

function getThisComponent(): any {
    @Component({
        selector: 'ng-test',
        template: '<h1 (click)="onClick()">Whhooooah, I am working! Now click here!/h1>',
    })
    class NgTextClass implements OnInit {
        constructor(private helloWorldService: HelloWorldService) {}

        public ngOnInit(): void {
            console.log('I was initialized!!!');
        }

        public onClick(): void {
            this.helloWorldService.sayHello('NgTextClass');
        }
    }

    return NgTextClass;
}
