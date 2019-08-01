import { Component, Input, Output, EventEmitter } from '@angular/core';
import {Todo} from '../todo';

@Component({
  selector: 'app-list-item',
  templateUrl: './list-item.component.html',
  styleUrls: ['./list-item.component.scss']
})
export class ListItemComponent {

  @Input() todo: Todo;
  @Output() clickDelete = new EventEmitter<Todo>();
  @Output() clickUpdate = new EventEmitter();

  switchDone() {
    this.todo.done = !this.todo.done;
  }

  deleteItem() {
    this.clickDelete.emit(this.todo);
  }

  updateItem() {
    this.switchDone();
    this.clickUpdate.emit();
  }
}
