import {
    Compiler,
    CompilerFactory,
    COMPILER_OPTIONS,
    Component,
    Input,
    NgModule,
    OnChanges,
    ViewChild,
    ViewContainerRef,
} from '@angular/core';
import { JitCompilerFactory } from '@angular/platform-browser-dynamic';
import { createCompiler } from './create-jit-compiler';

export interface ComponentMetadata {
    component: any | string;
    declarations?: any[];
    imports?: any[];
}

@Component({
    selector: 'ng-runtime-component-creator',
    template: ` <ng-container #viewContainerRef></ng-container> `,
    styles: [],
})
export class RuntimeComponentCreatorComponent implements OnChanges {
    @Input() public componentMetadata!: ComponentMetadata;

    @ViewChild('viewContainerRef', { read: ViewContainerRef, static: true })
    public viewContainerRef!: ViewContainerRef;

    constructor(private compiler: Compiler) {}

    public ngOnChanges(): void {
        this.destroyExistingView();
        this.createViewAndAttatchItToContainer(this.componentMetadata);
    }

    private destroyExistingView(): void {
        this.viewContainerRef.remove();
    }

    private async createViewAndAttatchItToContainer({ component, declarations = [], imports = [] }: ComponentMetadata): Promise<void> {
        const tmpModule = NgModule({
            declarations: [this.getComponent(component)],
            imports: [...imports],
        })(class {});

        try {
            this.compiler.compileModuleAndAllComponentsAsync(tmpModule).then(
                (factories) => {
                    const f = factories.componentFactories[0];
                    const cmpRef = this.viewContainerRef.createComponent(f);
                },
                (error) => {
                    console.error(error);
                }
            );
        } catch (error) {
            console.error(error);
        }
    }

    private getComponent(component: any | string): any {
        if (typeof component === 'string') {
            @Component({
                selector: 'ng-runtime-component-creator-dummy-selector',
                template: component,
            })
            class NgRuntmieComponentCreatorDummySelectorComponent {}
            return NgRuntmieComponentCreatorDummySelectorComponent;
        } else {
            return component;
        }
    }
}

@NgModule({
    declarations: [RuntimeComponentCreatorComponent],
    exports: [RuntimeComponentCreatorComponent],
    providers: [
        { provide: COMPILER_OPTIONS, useValue: {}, multi: true },
        {
            provide: CompilerFactory,
            useClass: JitCompilerFactory,
            deps: [COMPILER_OPTIONS],
        },
        {
            provide: Compiler,
            useFactory: createCompiler,
            deps: [CompilerFactory],
        },
    ],
})
export class RuntimeComponentCreatorModule {}
