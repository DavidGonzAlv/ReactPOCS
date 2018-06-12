import { StoreBase , AutoSubscribeStore , autoSubscribe } from 'resub';

import SqliteRepository = require('../repository/SqliteRepository');
import Todo = require('../models/Todo');


@AutoSubscribeStore
class TodoStore extends StoreBase { 
    private _todos: Todo.Todo[] = [];

    init (){
        return SqliteRepository.getAllTodos().then(todos => {
        this._todos = todos;
        });
    }

    addTodo(todoText : string ){
        const now = Date.now().valueOf();
        let newTodo : Todo.Todo = {
            id : now.toString(),
            creationTime: now,
            text : todoText,
            _searchTerms : todoText
        };

        this._todos = this._todos.concat(newTodo);

        SqliteRepository.putTodo(newTodo);

        this.trigger();
    }

    @autoSubscribe
    getTodos(){
        return this._todos;
    }
}

export = new TodoStore();