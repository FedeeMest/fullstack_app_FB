import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ChangeadminComponent } from './changeadmin.component';

describe('ChangeadminComponent', () => {
  let component: ChangeadminComponent;
  let fixture: ComponentFixture<ChangeadminComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ChangeadminComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ChangeadminComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
