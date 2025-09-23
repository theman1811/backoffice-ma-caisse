import { ComponentFixture, TestBed } from '@angular/core/testing';

import { Administrateurs } from './administrateurs';

describe('Administrateurs', () => {
  let component: Administrateurs;
  let fixture: ComponentFixture<Administrateurs>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [Administrateurs]
    })
    .compileComponents();

    fixture = TestBed.createComponent(Administrateurs);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
