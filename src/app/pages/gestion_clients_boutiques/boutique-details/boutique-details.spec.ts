import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BoutiqueDetails } from './boutique-details';

describe('BoutiqueDetails', () => {
  let component: BoutiqueDetails;
  let fixture: ComponentFixture<BoutiqueDetails>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [BoutiqueDetails]
    })
    .compileComponents();

    fixture = TestBed.createComponent(BoutiqueDetails);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
