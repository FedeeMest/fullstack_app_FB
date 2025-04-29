import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ListadoIComponent } from './listado-i.component';

describe('ListadoIComponent', () => {
  let component: ListadoIComponent;
  let fixture: ComponentFixture<ListadoIComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ListadoIComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ListadoIComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
