import React, { Component } from 'react'
import { Route } from 'react-router-dom'
import * as BooksAPI from './BooksAPI'
import ListBooks from './ListBooks'
import SearchBook from './SearchBook'
import './App.css'


class App extends Component {
  state = {
    books: [],
    showSearchPage: false,
    resultBooks: []
  }
    componentDidMount() {
    BooksAPI.getAll().then((books) => {
     this.setState({ books })
    })
  }

  changeShelf(book, shelf){
    // First update the server about the change
    BooksAPI.update(book, shelf).then(() => {
      // Then update the local version
      book.shelf = shelf;


      // Refresh the state
      this.setState(state => ({
          books: state.books
      }));
  });
}; 

setQuery = (query) => {
  if(query){
      BooksAPI.search(query).then((books) => {
          // if the BookAPI.search worked properly, this would be unnecessary
          if(books.length){
              books.forEach((book, index) => {
                  let myBook = this.state.books.find((b) => b.id === book.id);
                  book.shelf = myBook ? myBook.shelf : 'none';
                  books[index] = book;
              });

              this.setState({
                  resultBooks: books
              });
          }

      });
      } else {
      this.setState({
          resultBooks: []
      });
  }
};

getBookshelf(book){
  this.props.books.filter((book) => book.shelf)
};
 

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
            onChangeShelf={this.changeShelf.bind(this)}
            books={this.state.books}
          />
        )}/>
      </div>
    )
  }
}

export default App;
