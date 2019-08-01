import {Component, OnInit} from '@angular/core';
import {Todo} from '../todo';
import {ListService} from './list.service';
import {ShowOptions} from '../showoptions';

@Component({
  selector: 'app-list',
  templateUrl: './list.component.html',
  styleUrls: ['./list.component.scss']
})
export class ListComponent implements OnInit {

  private todos: Todo[];
  private numTodosLeft: number;
  private showMode: ShowOptions;

  constructor(private listService: ListService) {}

  ngOnInit(): void {
    this.showAll();
    this.showMode = ShowOptions.All;
    this.numTodosLeft = this.todos.filter(item => item.done !== true).length;
  }

  addItem(task: string) {
    this.todos = this.listService.addItem(task);
    this.numTodosLeft++;
  }

  deleteItem(deleteTodo: Todo) {
    if (deleteTodo.done !== true) {
      this.numTodosLeft--;
    }
    this.todos = this.listService.deleteItem(deleteTodo);
  }

  showAll(): void {
    this.showMode = ShowOptions.All;
    this.todos = this.listService.getAll();
  }

  showActive(): void  {
    this.showMode = ShowOptions.Active;
    this.todos = this.listService.getAllActive();
  }

  showDone(): void  {
    this.showMode = ShowOptions.Done;
    this.todos = this.listService.getAllDone();
  }

  clearComplete() {
    this.listService.getClearComplete();
    this.todos = this.todos.filter(item => item.done !== true);
  }

  update() {
    switch (this.showMode) {
      case ShowOptions.All:
        this.showAll();
        this.numTodosLeft = this.todos.filter(item => item.done !== true).length;
        break;
      case ShowOptions.Active:
        this.showActive();
        this.numTodosLeft = this.todos.filter(item => item.done !== true).length;
        break;
      case ShowOptions.Done:
        this.showDone();
        this.numTodosLeft = this.listService.getAllActive().length;
        break;
    }
  }
}
