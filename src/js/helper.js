let booksArray = [];

function renderBooks(books) {
  const unreadContainer = document.getElementById('unread-container');
  const readContainer = document.getElementById('read-container');
  unreadContainer.innerHTML = '';
  readContainer.innerHTML = '';

  function makeBookshelf(book) {
    const bookshelfBook = document.createElement('div');
    bookshelfBook.classList.add('bookshelf__book');
    bookshelfBook.setAttribute('draggable', true);
    bookshelfBook.id = book.id;
    bookshelfBook.value = book.isCompleted;
    return bookshelfBook;
  }

  books.forEach((book) => {
    if (book.isCompleted) {
      const bookshelfBook = makeBookshelf(book);
      bookshelfBook.classList.add('true');
      bookshelfBook.innerHTML = `
        <div class="bookshelf__book-text">
          <h3>${book.title}</h3>
          <p>${book.author} - ${book.year}</p>
        </div>
        <div class="bookshelf__book-buttons">
          <div class="bookshelf__book-button">
            <button onclick="uncheckBook(${book.id})" title="Baca buku lagi">
              <i class="fas fa-check-square"></i>
            </button>
            <button onclick="confirmDelete(${book.id})" title="Hapus buku">
              <i class="far fa-trash-alt"></i>
            </button>
          </div>
          <div class="bookshelf__book-button">
            <button title="drag buku" class="drag-button" title="drag buku">
              <i class="fas fa-bars"></i>
            </button>
          </div>
        </div>
      `;
      readContainer.appendChild(bookshelfBook);
    } else {
      const bookshelfBook = makeBookshelf(book);
      bookshelfBook.classList.add('false');
      bookshelfBook.innerHTML = `
        <div class="bookshelf__book-text">
          <h3>${book.title}</h3>
          <p>${book.author} - ${book.year}</p>
        </div>
        <div class="bookshelf__book-buttons">
          <div class="bookshelf__book-button">
            <button onclick="checkBook(${book.id})" title="Centang Buku">
              <i class="far fa-check-square"></i>
            </button>
            <button onclick="confirmDelete(${book.id})" title="Hapus buku">
              <i class="far fa-trash-alt"></i>
            </button>
          </div>
          <div class="bookshelf__book-button">
            <button id="${book.id}" class="drag-button" title="drag buku">
              <i class="fas fa-bars"></i>
            </button>
          </div>
        </div>
      `;
      unreadContainer.appendChild(bookshelfBook);
    }
  });
}

function refreshBooks() {
  localStorage.setItem('book', JSON.stringify(booksArray));
  renderBooks(booksArray);
}

function checkBook(id) {
  const bookIndex = booksArray.findIndex((book) => book.id === id);
  booksArray[bookIndex].isCompleted = true;
  refreshBooks();
}

function uncheckBook(id) {
  const bookIndex = booksArray.findIndex((book) => book.id === id);
  booksArray[bookIndex].isCompleted = false;
  refreshBooks();
}

function deleteBook(id, confirmation) {
  const dialogue = document.getElementById('confirm-container');
  dialogue.remove();
  if (confirmation) {
    booksArray = booksArray.filter((book) => book.id !== id);
    localStorage.setItem('book', JSON.stringify(booksArray));
    refreshBooks();
  }
}

function confirmDelete(id) {
  const main = document.querySelector('main');
  const dialogue = document.createElement('div');
  dialogue.id = 'confirm-container';
  dialogue.classList.add('confirm');
  dialogue.innerHTML = `
    <h3>Apakah benar anda ingin menghapus buku ini?</h3>
    <div class="confirm__buttons">
      <button id="confirm-true" onclick="deleteBook(${id}, true)">Okay</button>
      <button id="confirm-false" onclick="deleteBook(${id}, false)">Cancel</button>
    </div>
  `;
  main.appendChild(dialogue);
}

function submitBook(form) {
  form.addEventListener('submit', (event) => {
    event.preventDefault();
    const title = document.getElementById('input-title');
    const author = document.getElementById('input-author');
    const year = document.getElementById('input-year');
    const isCompleted = document.getElementById('input-isCompleted');
    const dataBook = {
      id: +new Date(),
      title: title.value,
      author: author.value,
      year: year.value,
      isCompleted: isCompleted.checked,
    };
    booksArray.push(dataBook);
    refreshBooks();
  });
}

function searchBook(form) {
  form.addEventListener('submit', (event) => {
    event.preventDefault();
    const searchTitle = document.getElementById('search-book-title').value;

    if (searchTitle) {
      renderBooks(
        booksArray.filter((book) => book.title.toLowerCase().includes(searchTitle.toLowerCase())),
      );
    } else {
      renderBooks(booksArray);
    }
  });
}

function fillArray() {
  booksArray = JSON.parse(localStorage.getItem('book')) || [];
  renderBooks(booksArray);
}

function hasClass(element, className) {
  return element.classList.contains(className);
}

function dragBook(bookshelves) {
  document.addEventListener('dragstart', (event) => {
    if (hasClass(event.target, 'bookshelf__book')) {
      event.target.classList.add('dragging');
    }
  });

  document.addEventListener('dragend', (event) => {
    if (hasClass(event.target, 'bookshelf__book')) {
      event.target.classList.remove('dragging');
    }
  });

  [...bookshelves].forEach((bookshelf) => {
    bookshelf.addEventListener('dragover', (event) => {
      event.preventDefault();
    });
  });

  [...bookshelves].forEach((bookshelf) => {
    bookshelf.addEventListener('drop', (event) => {
      event.preventDefault();
      const draggingBook = document.querySelector('.dragging');
      const bookType = draggingBook.classList.contains('true');
      if (bookType) {
        uncheckBook(Number(draggingBook.id));
      } else {
        checkBook(Number(draggingBook.id));
      }
    });
  });
}
