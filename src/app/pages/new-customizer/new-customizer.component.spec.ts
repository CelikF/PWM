import { ComponentFixture, TestBed } from '@angular/core/testing';

import { NewCustomizerComponent } from './new-customizer.component';

describe('NewCustomizerComponent', () => {
  let component: NewCustomizerComponent;
  let fixture: ComponentFixture<NewCustomizerComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [NewCustomizerComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(NewCustomizerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
