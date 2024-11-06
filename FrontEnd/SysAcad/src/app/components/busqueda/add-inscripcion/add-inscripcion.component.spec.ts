import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AddInscripcionComponent } from './add-inscripcion.component';

describe('AddInscripcionComponent', () => {
  let component: AddInscripcionComponent;
  let fixture: ComponentFixture<AddInscripcionComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AddInscripcionComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AddInscripcionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
