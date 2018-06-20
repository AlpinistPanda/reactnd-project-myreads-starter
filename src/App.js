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

    // See if the book is in the list

    const index = this.state.books.findIndex((key) => {
      return key.id === book.id;
    });
    let tempList = this.state.books;

    if (index === -1) {
      // the book is not in the list, copy it
      book.shelf = shelf;
      tempList.push(book);

    } else {

      // it is already in the list just change the shelf
      tempList[index].shelf = shelf;
    }

    BooksAPI.update(book, shelf).then(
      this.setState({ books: tempList })
    );



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
