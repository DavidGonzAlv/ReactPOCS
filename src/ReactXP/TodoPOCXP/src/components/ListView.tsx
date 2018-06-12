import RX = require('reactxp');
import { ComponentBase } from 'resub';
import { VirtualListView , VirtualListViewItemInfo } from 'reactxp-virtuallistview';

import TodosStore = require('../store/TodosStore');


interface TodoListViewItemInfo extends VirtualListViewItemInfo{
    text:string;
}

interface TodoListState {
    todos?: TodoListViewItemInfo[];
}

class TodoListView extends ComponentBase<{},TodoListState>{
    protected _buildState(props: {},initialBuild : boolean) : TodoListState{
        return {
            todos: TodosStore.getTodos().map((todo, i) => {
                return {
                    key: i.toString(),
                    height: 32,
                    template: 'todo',
                    text: todo.text
                };
            })
        };
    }

    private _renderItem = (item: TodoListViewItemInfo, hasFocus?: boolean) => {
        return (
            <RX.View >
                <RX.Text style={ RX.Styles.createTextStyle({backgroundColor: 'red'})} numberOfLines={ 1 }>
                    { item.text }
                </RX.Text>
            </RX.View>
        );
    }
        render() {
            return (
                <VirtualListView
                    itemList={ this.state.todos }
                    renderItem={ this._renderItem }
                    
                />
            );
        }
}

export = TodoListView;