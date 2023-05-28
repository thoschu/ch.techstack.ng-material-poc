import { Component } from '@angular/core';
import {FormBuilder, FormControlState, FormGroup, Validators} from '@angular/forms';

@Component({
  selector: 'app-step-one',
  templateUrl: './step-one.component.html',
  styleUrls: ['./step-one.component.scss']
})
export class StepOneComponent {
  private readonly telRegex: RegExp = /^[\+]?[(]?[0-9]{3}[)]?[-\s\.]?[0-9]{3}[-\s\.]?[0-9]{4,6}$/im;
  public readonly formGroup: FormGroup;

  constructor(private readonly formBuilder: FormBuilder) {
    this.formGroup = this.formBuilder.group({
      email: ['', [Validators.required, Validators.email, Validators.minLength(5)]],
      category: ['NEW', Validators.required],
      releasedAt: [new Date(), Validators.required],
      downloadsAllowed: [true, Validators.requiredTrue],
      description: ['', [Validators.required, Validators.minLength(3), Validators.maxLength(30)]],
      tel: ['', [Validators.required, Validators.pattern(this.telRegex)]]
    });
  }
}
