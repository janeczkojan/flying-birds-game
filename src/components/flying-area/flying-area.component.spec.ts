import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FlyingAreaComponent } from './flying-area.component';

describe('FlyingAreaComponent', () => {
  let component: FlyingAreaComponent;
  let fixture: ComponentFixture<FlyingAreaComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [FlyingAreaComponent]
    }).compileComponents();

    fixture = TestBed.createComponent(FlyingAreaComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
