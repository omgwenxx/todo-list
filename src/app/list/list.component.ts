import { ListService } from './list.service';
import { Todo } from '../todo';
import { Component, Input, OnChanges, OnInit } from '@angular/core';
import {debounceTime, distinctUntilChanged, switchMap} from 'rxjs/operators';
import {Subject} from 'rxjs';

@Component({
  selector: 'app-list',
  templateUrl: './list.component.html',
  styleUrls: ['./list.component.scss'],
})
export class ListComponent implements OnInit {
  private todos$;
  private allTodos$;
  private searchTodos$;
  private searchTerms = new Subject<string>();
  constructor(private listService: ListService) {}

  ngOnInit(): void {
    this.showAllTodos();
    this.searchTodos$ = this.searchTerms.pipe(
        // wait 300ms after each keystroke before considering the term
        debounceTime(300),

        // ignore new term if same as previous term
        distinctUntilChanged(),

        // switch to new search observable each time the term changes
        switchMap((term: string) => this.listService.searchTodo(term)),
    );
  }

  // Push a search term into the observable stream.
  search(term: string): void {
    this.searchTerms.next(term);
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
