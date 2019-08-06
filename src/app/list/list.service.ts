import { Todo } from '../todo';
import { Injectable, OnChanges } from '@angular/core';
import { AngularFirestore } from '@angular/fire/firestore';
import { from, Observable, of } from 'rxjs';
import { first, map, switchMap, tap } from 'rxjs/operators';

@Injectable({
  providedIn: 'root',
})
export class ListService {
  private todos: Observable<Todo[]>;
  private databaseName = 'todos';

  constructor(private database: AngularFirestore) {
    this.todos = this.database
      .collection<Todo>(this.databaseName)
      .valueChanges()
      .pipe(map((res) => res as Todo[]));
  }

  addItem(task: string): void {
    const id = this.database.createId();
    this.database
      .collection(this.databaseName)
      .doc(id)
      .set({ id, task, done: false });
  }

  deleteItem(deleteTodo: Todo): void {
    this.database
      .collection<Todo>(this.databaseName)
      .doc(deleteTodo.id)
      .delete();
  }

  getAll(): Observable<Todo[]> {
    return (this.todos = this.database.collection<Todo>(this.databaseName).valueChanges());
  }

  clearComplete(): Observable<any> {
    const todos$ = this.database
      .collection<Todo>(this.databaseName, (ref) => ref.where('done', '==', true))
      .valueChanges()
      .pipe(first());

    const deleteEach$ = (todos) => {
      const deletionPromises = todos.map((todo) => {
        return this.database
          .collection(this.databaseName)
          .doc(todo.id)
          .delete();
      });
      const deletionPromise = Promise.all(deletionPromises);
      return from(deletionPromise);
    };

    const result$ = todos$.pipe(switchMap(deleteEach$));
    return result$;
  }

  updateTodo(updateTodo: Todo) {
    this.database
      .collection(this.databaseName)
      .doc(updateTodo.id)
      .update({ done: updateTodo.done });
  }

  getAllActive(): Observable<Todo[]> {
    return this.database
      .collection<Todo>(this.databaseName, (ref) => ref.where('done', '==', false))
      .valueChanges();
  }

  getAllDone(): Observable<Todo[]> {
    return this.database
      .collection<Todo>(this.databaseName, (ref) => ref.where('done', '==', true))
      .valueChanges();
  }

  searchTodo(searchValue: string): Observable<Todo[]> {
    if (!searchValue.trim()) {
      // if not search term, return empty hero array.
      return of([]);
    }

    return this.database
      .collection<Todo>(this.databaseName, (ref) =>
        ref.orderBy('task')
            .startAt(searchValue)
            .endAt(searchValue + '\uf8ff')
          .limit(10))
      .valueChanges().pipe(tap(console.log));
  }
}
