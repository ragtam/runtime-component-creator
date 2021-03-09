import {
    Compiler,
    Component,
    ComponentFactory,
    ComponentRef,
    Input,
    NgModule,
    OnChanges,
    ReflectiveInjector,
    ViewChild,
    ViewContainerRef,
} from '@angular/core';

export interface ComponentMetadata {
    component: Component;
    declarations: any[];
    imports: any[];
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
        const componentDefinition = this.getComponentDefinition(
            this.componentMetadata ? this.componentMetadata.component : null
        );
        if (componentDefinition) {
            this.createViewAndAttatchItToContainer(componentDefinition);
        }
    }

    private destroyExistingView(): void {
        this.viewContainerRef.remove();
    }

    private getComponentDefinition(component: Component | null): any {
        return component
            ? Component({
                  selector: 'ng-runtime-component-creator-placeholder',
                  template: component.template,
                  styles:
                      component.styles && component.styles.length
                          ? component.styles
                          : [],
              })(class NgRuntimeComponentCreatorPlaceholder {})
            : null;
    }

    private async createViewAndAttatchItToContainer(componentDefinition: any): Promise<void> {
        const injector = ReflectiveInjector.fromResolvedProviders(
            [],
            this.viewContainerRef.parentInjector
        );
        const componentFactory = await this.createDynamicFactory(
            injector,
            componentDefinition,
            this.componentMetadata.imports
        );
        const componentRef = this.createComponent(componentFactory, injector);
        componentRef.changeDetectorRef.detectChanges();
    }

    private async createDynamicFactory(
        injector: ReflectiveInjector,
        component: any,
        moduleImports: any = []
    ): Promise<ComponentFactory<any>> {
        @NgModule({
            imports: [...moduleImports],
            declarations: [component],
            entryComponents: [component],
        })
        class DynamicModule {}

        const ngModuleFactory = await this.compiler.compileModuleAsync(
            DynamicModule
        );
        const ngModuleRef = ngModuleFactory.create(injector);
        return ngModuleRef.componentFactoryResolver.resolveComponentFactory(
            component
        );
    }

    private createComponent(
        componentFactory: ComponentFactory<any>,
        injector: ReflectiveInjector
    ): ComponentRef<any> {
        const componentRef = this.viewContainerRef.createComponent(
            componentFactory,
            0,
            injector,
            []
        );
        componentRef.onDestroy(() => {
            componentRef.changeDetectorRef.detach();
        });
        return componentRef;
    }
}

@NgModule({
    declarations: [RuntimeComponentCreatorComponent],
    exports: [RuntimeComponentCreatorComponent],
})
export class RuntimeComponentCreatorModule {}
