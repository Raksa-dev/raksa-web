import { Component, EventEmitter, Input, Output } from '@angular/core';
import { NgbTimepickerModule, NgbTimeStruct } from '@ng-bootstrap/ng-bootstrap';
import { FormControl, ReactiveFormsModule } from '@angular/forms';
import { JsonPipe, NgIf } from '@angular/common';

@Component({
  selector: 'app-custome-time-picker',
  templateUrl: './custome-time-picker.component.html',
  styleUrls: ['./custome-time-picker.component.scss'],
  imports: [NgbTimepickerModule, ReactiveFormsModule, JsonPipe, NgIf],
  standalone: true,
})
export class CustomeTimePickerComponent {
  @Input() time: any;
  @Output() timeChange = new EventEmitter<any>();

  updateTime(newTime: any) {
    this.time = newTime;
    this.timeChange.emit(newTime);
  }

  ctrl = new FormControl<NgbTimeStruct | null>(
    null,
    (control: FormControl<NgbTimeStruct | null>) => {
      const value = control.value;
      if (!value) {
        return null;
      }

      if (value.hour > 24) {
        return { hourError: true };
      }
      if (value.minute > 60) {
        return { minError: true };
      }
      if (value.second > 60) {
        return { secError: true };
      }

      return null;
    }
  );
}
