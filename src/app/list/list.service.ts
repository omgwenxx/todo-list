import { Injectable } from '@angular/core';
import {Todo} from '../todo';

@Injectable({
  providedIn: 'root'
})
export class ListService {

  private todos: Todo[] = [
    {id: 1, task: 'Undone1', done: false},
    {id: 2, task: 'Undone2', done: false},
    {id: 3, task: 'Undone3', done: false},
    {id: 4, task: 'Done1', done: true},
    {id: 5, task: 'Done2', done: true},
  ];

  constructor() {}

  addItem(task: string): Todo[] {
    const id = this.todos.length > 0 ? Math.max(...this.todos.map(todo => todo.id)) + 1 : 1;
    this.todos.push(new Todo(id, task, false));
    return this.todos;
  }

  deleteItem(deleteTodo: Todo): Todo[] {
    this.todos = this.todos.filter(item => item.id !== deleteTodo.id);
    return this.todos;
  }

  getAll(): Todo[] {
    return this.todos;
  }

  getAllActive(): Todo[]  {
    return this.todos.filter(item => item.done !== true);
  }

  getAllDone(): Todo[]  {
    return this.todos.filter(item => item.done === true);
  }

  getClearComplete(): void {
    this.todos = this.todos.filter(item => item.done !== true);
  }
}
