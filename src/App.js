import React, { Component } from 'react';
import ReactDOM from 'react-dom';
import { Provider, connect } from 'react-redux'
import { applyMiddleware, createStore, combineReducers, bindActionCreators } from 'redux'

//TODO: Define actions
function removeFromList(text) {
  return {
    type: 'removeFromList',
    text
  }
}
//Define reducer
let reducer = function (state = {
  initial_array: [
    { id: 0, nome: 'Alberto' },
    { id: 1, nome: 'Matteo' },
    { id: 2, nome: 'Marco' },
    { id: 3, nome: 'Gino' },
    { id: 4, nome: 'Patrizia' }
  ],
  send_to_delete: []
}, action) {
  switch (action.type) {
    case removeFromList:

      let send_to_delete = state.send_to_delete;
      // Se il valore da eliminare non è già presente nell array da passare al server
      if (!send_to_delete.includes(action.state)) {
        // Lo elimino anche dall array iniziale 
        // Oppure invece che eliminare manualmente , ad ogni elimina potrei fare un fetch della nuova lista
        let iniziale = state.initial_array;
        //let index = iniziale.map((ele) => { return ele.id }).indexOf(action.state)
        var Exindex = iniziale.findIndex(i => i.id === action.state);
        var newArr = iniziale.filter(function (value, index, arr) {
          return index !== Exindex
        })
        // Aggiorno l array da passare al server e aggiorno l elenco visivo
        return {
          //...state,
          initial_array: newArr,
          send_to_delete: [...state.send_to_delete, action.state],
        }
      }


    default:
      return state;
  }
}
//create the store
let store = createStore(reducer);

// Container component
class Container extends Component {
  constructor(props) {
      super(props);
      this.state = {
      };
  }

  render() {
      const { children } = this.props
      return (
          <div className="container">
              <div className="row my-5">
                  <div className="col-xl-4 offset-xl-4 ">
                      {children}
                  </div>
              </div>
          </div>
      );
  }
}



//Users List component
class UsersList extends Component {
  constructor() {
    super()
    this.state = {
    }
  }
  componentDidMount = () => {

  };

  render() {
    const { values } = this.props;
    return (
      <ul className="list-group">
        {values.map((ele) => {
          return (
            <li className="list-group-item clearfix">
              {ele.nome}
              <button className="btn btn-primary float-end" onClick={() => this.props.backFromUser(ele)} >Elimina</button>
            </li>
          )
        })}
      </ul>
    );
  }
}

class SaveButton extends Component {
  constructor(props) {
    super(props);
    this.state = {
    };
  }

  render() {
    const { onClick } = this.props;
    return (
      <button onClick={onClick} className="btn btn-primary my-5">SaveButton</button>
    );
  }
}

class Wrapper extends Component {
  constructor() {
    super()
    this.state = {

    }
  }
  componentDidMount() {
    // Qui dovrei effettuare il fetch per ricevere i dati e poi passarli a redux
    // Ad ora ho creato una lista fissa
  }
  backFromUser = (ele) => {
    let id = ele.id;
    this.props.removeFromListFunction(id)

  };
  saveButtonFunction = () => {
    console.log(store.getState())
    alert(JSON.stringify(store.getState()))
    // l'array SEND_TO_DELETE  è il dato da trasmettere al server per l eliminazione
    /*
    fetch('http://craon.it/action.php', {
      method: 'post',
      header: {
        'Accept': 'application/json',
        'Content-type': 'application/json'
      },
      body: JSON.stringify({
        action: "delete",
        id_list: this.props.send_to_delete,
      })

    }).then((response) => { console.log(response) })
    */
  }

  render() {
    return (
      <Container>
        <UsersList values={this.props.initial_array} backFromUser={this.backFromUser} />
        <SaveButton onClick={() => this.saveButtonFunction()} />
      </Container>
    )
  }
}
//State to props mapping
let mapStateToProps = function (state) {
  return {
    //TODO: define props to map
    initial_array: state.initial_array
  };
}
//Actions binding
function mapDispatchToProps(dispatch) {
  return {
    removeFromListFunction: (id) => dispatch({ type: removeFromList, state: id })
  }
}
//Container is mapped to Redux by default. You can also map UsersList if you need

const ReduxWrapper = connect(mapStateToProps, mapDispatchToProps)(Wrapper);
//Create the App Component
export default class App extends Component {
  render() {
    return (
      <ReduxWrapper />
    )
  }
}
//Render
ReactDOM.render(<Provider store={store}><App /></Provider>,
  document.getElementById('root'));