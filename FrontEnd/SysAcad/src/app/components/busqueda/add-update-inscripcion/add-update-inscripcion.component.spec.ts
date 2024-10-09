import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AddUpdateInscripcionComponent } from './add-update-inscripcion.component';

describe('AddUpdateInscripcionComponent', () => {
  let component: AddUpdateInscripcionComponent;
  let fixture: ComponentFixture<AddUpdateInscripcionComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AddUpdateInscripcionComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AddUpdateInscripcionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
