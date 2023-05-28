import { AfterViewInit, Component, ElementRef, ViewChild } from '@angular/core';
import { StepOneComponent } from "./step-one/step-one.component";

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements AfterViewInit {
  protected title: string = 'ng-material-poc';
  protected isLinear: boolean = true;
  protected isOptional: boolean = true;

  @ViewChild('stepOne') private readonly stepOne!: StepOneComponent;

  constructor() {}

  ngAfterViewInit(): void {
    this.stepOne.formGroup.valueChanges.subscribe((value: Record<string, unknown>): void => {
      console.log(value);
    });
  }

  next(step: StepOneComponent): void {
    console.log(step.formGroup.get('category')!.value);
  }
}
