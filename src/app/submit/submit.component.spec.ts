import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SubmitComponent } from './submit.component';
import { GameService } from '../service/game.service';
import { UserService } from '../service/user.service';
import { RouterTestingModule } from '@angular/router/testing';
import { MatSnackBarModule } from '@angular/material/snack-bar';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { FormsModule } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatButtonModule } from '@angular/material/button';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatInputModule } from '@angular/material/input';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { ReCaptchaV3Service } from 'ng-recaptcha';
import { mockCaptchaService } from '../service/user.service.spec';

describe('SubmitComponent', () => {
  let component: SubmitComponent;
  let fixture: ComponentFixture<SubmitComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ 
        SubmitComponent
       ],
      imports: [
        RouterTestingModule,
        MatSnackBarModule,
        HttpClientTestingModule,
        FormsModule,
        MatFormFieldModule,
        MatButtonModule,
        MatCheckboxModule,
        MatInputModule,
        BrowserAnimationsModule
      ],
      providers: [
        GameService,
        UserService,
        {provide: ReCaptchaV3Service, useClass: mockCaptchaService}
      ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SubmitComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
