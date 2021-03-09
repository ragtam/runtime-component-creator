import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RuntimeComponentCreatorComponent } from './runtime-component-creator.component';

describe('RuntimeComponentCreatorComponent', () => {
    let component: RuntimeComponentCreatorComponent;
    let fixture: ComponentFixture<RuntimeComponentCreatorComponent>;

    beforeEach(async () => {
        await TestBed.configureTestingModule({
            declarations: [RuntimeComponentCreatorComponent],
        }).compileComponents();
    });

    beforeEach(() => {
        fixture = TestBed.createComponent(RuntimeComponentCreatorComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });
});
