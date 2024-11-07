import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AddUpdateAlumnoComponent } from './add-update-alumno.component';

describe('AddUpdateAlumnoComponent', () => {
  let component: AddUpdateAlumnoComponent;
  let fixture: ComponentFixture<AddUpdateAlumnoComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AddUpdateAlumnoComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AddUpdateAlumnoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
