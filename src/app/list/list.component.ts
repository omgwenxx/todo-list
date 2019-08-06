import { ListService } from './list.service';
import { Todo } from '../todo';
import { Component, Input, OnChanges, OnInit } from '@angular/core';

@Component({
  selector: 'app-list',
  templateUrl: './list.component.html',
  styleUrls: ['./list.component.scss'],
})
export class ListComponent implements OnInit {
  private todos$;
  private allTodos$;
  constructor(private listService: ListService) {}

  ngOnInit(): void {
    this.showAllTodos();
  }

  addItem(task: string) {
    this.listService.addItem(task);
  }

  deleteItem(deleteTodo: Todo) {
    if (deleteTodo.done !== true) {
    }
    this.listService.deleteItem(deleteTodo);
  }

  update(updateTodo: Todo) {
    this.listService.updateTodo(updateTodo);
  }

  showAllTodos() {
    this.todos$ = this.listService.getAll();
    this.allTodos$ = this.todos$;
  }

  showActiveTodos() {
    this.todos$ = this.listService.getAllActive();
  }

  showDoneTodos() {
    this.todos$ = this.listService.getAllDone();
  }

  clearComplete() {
    this.listService.clearComplete().subscribe((_) => console.log('SUCESSFULLY DELETED'));
  }
}
