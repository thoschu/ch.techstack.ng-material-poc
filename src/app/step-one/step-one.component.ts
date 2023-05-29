import { Component, ViewEncapsulation } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';

@Component({
  selector: 'app-step-one',
  templateUrl: './step-one.component.html',
  styleUrls: ['./step-one.component.scss']
})
export class StepOneComponent {
  private static readonly LOREM_IPSUM_TEXT: string = `Lorem ipsum dolor sit amet.`;
  public readonly formGroup: FormGroup;

  constructor(private readonly formBuilder: FormBuilder) {
    this.formGroup = this.formBuilder.group({
      text: [StepOneComponent.LOREM_IPSUM_TEXT, [Validators.required, Validators.nullValidator]],
    });
  }
}
