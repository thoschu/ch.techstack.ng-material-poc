import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import {MatCalendarCellClassFunction} from "@angular/material/datepicker";

@Component({
  selector: 'app-step-one',
  templateUrl: './step-one.component.html',
  styleUrls: ['./step-one.component.scss']
})
export class StepOneComponent {
  public readonly formGroup: FormGroup;

  constructor(private readonly formBuilder: FormBuilder) {
    this.formGroup = this.formBuilder.group({
      email: ['', [Validators.required, Validators.email, Validators.minLength(5)]],
      releasedAt: [new Date(), Validators.required]
    });
  }

  protected dateClass(): MatCalendarCellClassFunction<Date> {

    return (cellDate: Date, view): string => {
      // 'month' | 'year' | 'multi-year'
      const date: number = cellDate.getDate();

      if(view == 'month') { }

      return ''
    };
  }
}
