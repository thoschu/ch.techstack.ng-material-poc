import { Component, ViewEncapsulation } from '@angular/core';
import {AbstractControl, FormBuilder, FormControl, FormControlState, FormGroup, Validators} from '@angular/forms';

@Component({
  selector: 'app-step-one',
  templateUrl: './step-one.component.html',
  styleUrls: ['./step-one.component.scss'],
  encapsulation: ViewEncapsulation.None
})
export class StepOneComponent {
  public readonly formGroup: FormGroup;

  constructor(private readonly formBuilder: FormBuilder) {
    this.formGroup = this.formBuilder.group({
      email: ['', [Validators.required, Validators.email, Validators.minLength(5)]],
      downloadsAllowed: [false, Validators.requiredTrue]
    });

    this.formGroup.valueChanges.subscribe((value: Record<string, string>): void => {
      const { length: emailLength }: { length: number } = value['email'];
      const downloadsAllowedControl: AbstractControl<string, string> | null = this.formGroup.get('downloadsAllowed');

      if (emailLength >= 3) {
        if(downloadsAllowedControl?.disabled) {
          downloadsAllowedControl?.enable();
        }
      } else if(downloadsAllowedControl?.enabled) {
        downloadsAllowedControl?.disable();
      }
    });
  }
}
