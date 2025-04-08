// src/app/auth/register/register.component.spec.ts
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { FormsModule } from '@angular/forms';
import { RegisterComponent } from './register.component';

describe('RegisterComponent', () => {
  let component: RegisterComponent;
  let fixture: ComponentFixture<RegisterComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ RegisterComponent ],
      imports: [ FormsModule ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(RegisterComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should show error if passwords do not match', () => {
    component.username = 'user';
    component.email = 'user@example.com';
    component.password = '123456';
    component.confirmPassword = '654321';
    expect(component.errorMessageRegister).toContain('Le password non coincidono.');
  });

  it('should register if form is valid', () => {
    component.username = 'user';
    component.email = 'user@example.com';
    component.password = '123456';
    component.confirmPassword = '123456';
    expect(component.errorMessageRegister).toBe('');
  });
});
