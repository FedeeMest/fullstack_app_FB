import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AddUpdateMateriaComponent } from './add-update-materia.component';

describe('AddUpdateMateriaComponent', () => {
  let component: AddUpdateMateriaComponent;
  let fixture: ComponentFixture<AddUpdateMateriaComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AddUpdateMateriaComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AddUpdateMateriaComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
