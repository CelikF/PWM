import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ManageinvitationComponent } from './manageinvitation.component';

describe('ManageinvitationComponent', () => {
  let component: ManageinvitationComponent;
  let fixture: ComponentFixture<ManageinvitationComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ManageinvitationComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ManageinvitationComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
