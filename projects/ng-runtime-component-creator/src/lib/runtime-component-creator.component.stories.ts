import { Component, OnInit } from '@angular/core';
import { moduleMetadata } from '@storybook/angular';
import { Story, Meta } from '@storybook/angular/types-6-0';
import { RuntimeComponentCreatorComponent, RuntimeComponentCreatorModule } from './runtime-component-creator.component';
import { storyMarkupWrapper } from './story-markup-wrapper';

export default {
    title: 'RuntimeComponentCreator',
    component: RuntimeComponentCreatorComponent,
    decorators: [
        moduleMetadata({
            imports: [RuntimeComponentCreatorModule],
        }),
        storyMarkupWrapper,
    ],
} as Meta;

function getThisComponent(): any {
    @Component({
        selector: 'ng-test',
        template: `
            <h2>This component has been compiled on the runtime.</h2>
            <h1>Class with @Component decorator used as input.</h1>
        `,
    })
    class NgTextClass implements OnInit {
        constructor() {}

        public ngOnInit(): void {
            console.log('I was initialized!!!');
        }
    }

    return NgTextClass;
}

export const ClassWithComponentDecorator: Story<RuntimeComponentCreatorComponent> = (args: RuntimeComponentCreatorComponent) => ({
    props: args,
    template: `
    <ng-runtime-component-creator [componentMetadata]="componentMetadata"></ng-runtime-component-creator>
    `,
});
ClassWithComponentDecorator.args = {
    componentMetadata: {
        component: getThisComponent(),
    },
};

export const HtmlString: Story<RuntimeComponentCreatorComponent> = (args: RuntimeComponentCreatorComponent) => ({
    props: args,
    template: `<ng-runtime-component-creator [componentMetadata]="componentMetadata"></ng-runtime-component-creator>
  `,
});
HtmlString.args = {
    componentMetadata: {
        component: '<h2>This component has been compiled on the runtime.</h2><h1>HTML string used as input.</h1>',
    },
};
