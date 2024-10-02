import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AddUpdateInscComponent } from './add-update-insc.component';

describe('AddUpdateInscComponent', () => {
  let component: AddUpdateInscComponent;
  let fixture: ComponentFixture<AddUpdateInscComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AddUpdateInscComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AddUpdateInscComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
