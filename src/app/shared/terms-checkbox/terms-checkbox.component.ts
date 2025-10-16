import { Component, EventEmitter, Input, Output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-terms-checkbox',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './terms-checkbox.component.html',
  styleUrls: ['./terms-checkbox.component.css'],
})
export class TermsCheckboxComponent {
  @Input() accepted = false;
  @Output() acceptedChange = new EventEmitter<boolean>();

  handleChange(event: Event) {
    const target = event.target as HTMLInputElement;
    this.accepted = target.checked;
    this.acceptedChange.emit(this.accepted);
  }
}
