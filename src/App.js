import React, { Component } from 'react'
import { Route } from 'react-router-dom'
import * as BooksAPI from './BooksAPI'
import ListBooks from './ListBooks'
import SearchBook from './SearchBook'
import './App.css'


class App extends Component {
  state = {
    books: [],
    showSearchPage: false
  }
    componentDidMount() {
    BooksAPI.getAll().then((books) => {
     this.setState({ books })
    })
  }

  changeShelf(book, shelf){
    BooksAPI.update(book, shelf).then(() => {
      BooksAPI.getAll().then((books) => {
        this.setState({ books })
    })
  })
  }

  render() {
    return (
      <div className='app'>
      <Route exact path="/" render={() => (
        <ListBooks
          onChangeShelf={this.changeShelf.bind(this)}
          books={this.state.books}
          shelf={['currentlyReading', 'read', 'wantToRead']}/>

        )}/>
      <Route path="/search" render={() => (
        <SearchBook
          />
        )}/>
      </div>
    )
  }
}

export default App
