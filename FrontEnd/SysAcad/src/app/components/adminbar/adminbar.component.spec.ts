import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AdminbarComponent } from './adminbar.component';

describe('AdminbarComponent', () => {
  let component: AdminbarComponent;
  let fixture: ComponentFixture<AdminbarComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AdminbarComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AdminbarComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
