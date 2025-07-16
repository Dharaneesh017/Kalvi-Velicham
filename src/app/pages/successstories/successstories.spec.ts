import { ComponentFixture, TestBed } from '@angular/core/testing';

import { Successstories } from './successstories';

describe('Successstories', () => {
  let component: Successstories;
  let fixture: ComponentFixture<Successstories>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [Successstories]
    })
    .compileComponents();

    fixture = TestBed.createComponent(Successstories);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
