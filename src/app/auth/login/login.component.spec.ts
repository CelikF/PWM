// src/app/auth/login/login.component.spec.ts
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { FormsModule } from '@angular/forms';
import { LoginComponent } from './login.component';

describe('LoginComponent', () => {
  let component: LoginComponent;
  let fixture: ComponentFixture<LoginComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ LoginComponent ],
      imports: [ FormsModule ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(LoginComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should not submit if form is invalid (empty fields)', () => {
    component.usernameOrEmail = '';
    component.password = '';
    expect(component.errorMessageLogin).toContain('Inserisci username o email.');
  });

  it('should login successfully with correct credentials', () => {
    component.usernameOrEmail = 'test';
    component.password = '123456';
    expect(component.errorMessageLogin).toBe('');
  });
});
