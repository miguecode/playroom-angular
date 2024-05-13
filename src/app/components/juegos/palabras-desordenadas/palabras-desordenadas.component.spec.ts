import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PalabrasDesordenadasComponent } from './palabras-desordenadas.component';

describe('PalabrasDesordenadasComponent', () => {
  let component: PalabrasDesordenadasComponent;
  let fixture: ComponentFixture<PalabrasDesordenadasComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PalabrasDesordenadasComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(PalabrasDesordenadasComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
