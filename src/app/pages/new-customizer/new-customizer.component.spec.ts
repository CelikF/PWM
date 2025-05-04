import { ComponentFixture, TestBed } from '@angular/core/testing';
import { NewsCustomizerComponent } from './new-customizer.component';

describe('NewsCustomizerComponent', () => {
  let component: NewsCustomizerComponent;
  let fixture: ComponentFixture<NewsCustomizerComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [NewsCustomizerComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(NewsCustomizerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
