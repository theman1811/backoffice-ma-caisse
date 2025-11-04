import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AppTopBar } from './app-top-bar';

describe('AppTopBar', () => {
  let component: AppTopBar;
  let fixture: ComponentFixture<AppTopBar>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AppTopBar]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AppTopBar);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
