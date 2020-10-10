import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { Canvas2Page } from './canvas2.page';

describe('Canvas2Page', () => {
  let component: Canvas2Page;
  let fixture: ComponentFixture<Canvas2Page>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ Canvas2Page ],
      imports: [IonicModule.forRoot()]
    }).compileComponents();

    fixture = TestBed.createComponent(Canvas2Page);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
