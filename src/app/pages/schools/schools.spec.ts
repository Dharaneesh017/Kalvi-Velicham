import { ComponentFixture, TestBed } from '@angular/core/testing';

import { Schools } from './schools';

describe('Schools', () => {
  let component: Schools;
  let fixture: ComponentFixture<Schools>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [Schools]
    })
    .compileComponents();

    fixture = TestBed.createComponent(Schools);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
