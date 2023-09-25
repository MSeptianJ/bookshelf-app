window.addEventListener('load', () => {
  fillArray();

  const addForm = document.getElementById('add-book');
  const searchForm = document.getElementById('search-book');
  const bookshelves = document.getElementsByClassName('bookshelf');
  submitBook(addForm);
  searchBook(searchForm);
  dragBook(bookshelves);
});
