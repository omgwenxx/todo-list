import { Pipe, PipeTransform } from '@angular/core';
import {Todo} from '../todo';

@Pipe({
  name: 'filterActive'
})
export class FilterActivePipe implements PipeTransform {

  transform(todos: Todo[]): Todo[] {
    if (!todos) {
      return null;
    }
    return todos.filter(todo => !todo.done);
  }

}
