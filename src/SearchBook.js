import React, { Component } from 'react'
import { Link } from 'react-router-dom'
import Books from './Books'
import * as BooksAPI from './BooksAPI'

class SearchBook extends Component {

  state = {
    query: '',
    resultBooks: []
  }

  /**
  * @description Sets the query and updates the state with results
  * @constructor
  * @param {string} query - Query keyword. Note these are restricted with a list
  */

  setQuery(query){
    this.setState({ query: query.trim() })
      if (query.length > 0) {
        BooksAPI.search(query).then((results) => {
          let resultBooks = []
          resultBooks = results
          BooksAPI.getAll().then((books) => {
            // nested loop to compare each book in our list with the
            // results of our search
            resultBooks.forEach(function(resultBook) {
              books.forEach(function(book) {
                if ( resultBook.id === book.id ) {
                  resultBook.shelf = book.shelf;
                }
                else {
                  resultBook.shelf = 'none'}
              })
            })
          })

          this.setState({ resultBooks: resultBooks })
        })}
  }

  /**
  * @description Change shelf of a selected book
  * @constructor
  * @param {object} book - selected book object
  * @param {string} shelf - shelf
  */

  changeShelf(book, shelf){
    BooksAPI.update(book, shelf).then(() => {
      BooksAPI.getAll().then((books) => {
        this.setState({ books })
    })
  })
  }

  render() {
    return (
      <div className="search-books">
        <div className="search-books-bar">
          <Link className="close-search" to="/">
            Close
          </Link>
          <div className="search-books-input-wrapper">
            {/*
              NOTES: The search from BooksAPI is limited to a particular set of search terms.
              You can find these search terms here:
              https://github.com/udacity/reactnd-project-myreads-starter/blob/master/SEARCH_TERMS.md

              However, remember that the BooksAPI.search method DOES search by title or author. So, don't worry if
              you don't find a specific author or title. Every search is limited by search terms.
            */}
            <input
              type="text"
              placeholder="Search by title or author"
              onChange={(e) => this.setQuery(e.target.value)}
              value={this.state.query} />

          </div>
        </div>
        <div className="search-books-results">
          <ol className="books-grid">
            {this.state.resultBooks.map((book) => {
              return (
                <li key={ book.id } >
                  <Books
                    book={ book }
                    onChangeShelf={this.changeShelf.bind(this)} />
                </li>
              )
            })
          }
          </ol>
        </div>
      </div>
   )
  }
}

export default SearchBook
