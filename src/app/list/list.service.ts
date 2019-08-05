import {Todo} from '../todo';
import {Injectable, OnChanges} from '@angular/core';
import {AngularFirestore} from '@angular/fire/firestore';
import {Observable} from 'rxjs';
import {map, tap} from 'rxjs/operators';

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
            .set({id, task, done: false});
    }

    deleteItem(deleteTodo: Todo): void {
        this.database
            .collection<Todo>(this.databaseName)
            .doc(deleteTodo.id)
            .delete();
    }

    getAll(): Observable<Todo[]> {
        return (this.todos = this.database
            .collection<Todo>(this.databaseName)
            .valueChanges());
    }

    clearComplete() {
        this.database
            .collection<Todo>(this.databaseName, (ref) => ref.where('done', '==', true))
            .get().forEach((snapshot) => {
                snapshot.docs.forEach((todo) => {
                    this.database
                        .collection(this.databaseName)
                        .doc(todo.id)
                        .delete();
                });
            });
    }

    updateTodo(updateTodo: Todo) {
        this.database
            .collection(this.databaseName)
            .doc(updateTodo.id)
            .update({done: updateTodo.done});
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
}
