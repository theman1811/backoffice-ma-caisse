import { ComponentFixture, TestBed } from '@angular/core/testing';

import { Analytiques } from './analytiques';

describe('Analytiques', () => {
  let component: Analytiques;
  let fixture: ComponentFixture<Analytiques>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [Analytiques]
    })
    .compileComponents();

    fixture = TestBed.createComponent(Analytiques);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
