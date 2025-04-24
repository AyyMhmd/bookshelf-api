const { nanoid } = require('nanoid');
const books = [];

const addBookHandler = (req, res, body) => {
  const {
    name, year, author, summary,
    publisher, pageCount, readPage, reading
  } = body;

  if (!name) {
    res.writeHead(400, { 'Content-Type': 'application/json' });
    res.end(JSON.stringify({
      status: 'fail',
      message: 'Gagal menambahkan buku. Mohon isi nama buku',
    }));
    return;
  }

  if (readPage > pageCount) {
    res.writeHead(400, { 'Content-Type': 'application/json' });
    res.end(JSON.stringify({
      status: 'fail',
      message: 'Gagal menambahkan buku. readPage tidak boleh lebih besar dari pageCount',
    }));
    return;
  }

  const id = nanoid(16);
  const insertedAt = new Date().toISOString();
  const updatedAt = insertedAt;
  const finished = pageCount === readPage;

  const newBook = {
    id, name, year, author, summary,
    publisher, pageCount, readPage,
    finished, reading, insertedAt, updatedAt,
  };

  books.push(newBook);

  res.writeHead(201, { 'Content-Type': 'application/json' });
  res.end(JSON.stringify({
    status: 'success',
    message: 'Buku berhasil ditambahkan',
    data: {
      bookId: id,
    },
  }));
};

const getAllBooksHandler = (req, res) => {
  const { searchParams } = new URL(req.url, `http://${req.headers.host}`);
  const nameQuery = searchParams.get('name');
  const readingQuery = searchParams.get('reading');
  const finishedQuery = searchParams.get('finished');

  let filteredBooks = books;

  if (nameQuery) {
    filteredBooks = filteredBooks.filter((book) =>
      book.name.toLowerCase().includes(nameQuery.toLowerCase())
    );
  }

  if (readingQuery === '0' || readingQuery === '1') {
    const isReading = readingQuery === '1';
    filteredBooks = filteredBooks.filter((book) => book.reading === isReading);
  }

  if (finishedQuery === '0' || finishedQuery === '1') {
    const isFinished = finishedQuery === '1';
    filteredBooks = filteredBooks.filter((book) => book.finished === isFinished);
  }

  const booksSummary = filteredBooks.map((book) => ({
    id: book.id,
    name: book.name,
    publisher: book.publisher,
  }));

  res.writeHead(200, { 'Content-Type': 'application/json' });
  res.end(JSON.stringify({
    status: 'success',
    data: {
      books: booksSummary,
    },
  }));
};

const getBookByIdHandler = (req, res, bookId) => {
  const book = books.find((b) => b.id === bookId);

  if (!book) {
    res.writeHead(404, { 'Content-Type': 'application/json' });
    res.end(JSON.stringify({
      status: 'fail',
      message: 'Buku tidak ditemukan',
    }));
    return;
  }

  res.writeHead(200, { 'Content-Type': 'application/json' });
  res.end(JSON.stringify({
    status: 'success',
    data: {
      book,
    },
  }));
};

const editBookByIdHandler = (req, res, bookId, body) => {
  const {
    name, year, author, summary,
    publisher, pageCount, readPage, reading
  } = body;

  const index = books.findIndex((b) => b.id === bookId);

  if (index === -1) {
    res.writeHead(404, { 'Content-Type': 'application/json' });
    res.end(JSON.stringify({
      status: 'fail',
      message: 'Gagal memperbarui buku. Id tidak ditemukan',
    }));
    return;
  }

  if (!name) {
    res.writeHead(400, { 'Content-Type': 'application/json' });
    res.end(JSON.stringify({
      status: 'fail',
      message: 'Gagal memperbarui buku. Mohon isi nama buku',
    }));
    return;
  }

  if (readPage > pageCount) {
    res.writeHead(400, { 'Content-Type': 'application/json' });
    res.end(JSON.stringify({
      status: 'fail',
      message: 'Gagal memperbarui buku. readPage tidak boleh lebih besar dari pageCount',
    }));
    return;
  }

  const updatedAt = new Date().toISOString();
  const finished = pageCount === readPage;

  books[index] = {
    ...books[index],
    name, year, author, summary,
    publisher, pageCount, readPage,
    finished, reading, updatedAt,
  };

  res.writeHead(200, { 'Content-Type': 'application/json' });
  res.end(JSON.stringify({
    status: 'success',
    message: 'Buku berhasil diperbarui',
  }));
};

const deleteBookByIdHandler = (req, res, bookId) => {
  const index = books.findIndex((b) => b.id === bookId);

  if (index === -1) {
    res.writeHead(404, { 'Content-Type': 'application/json' });
    res.end(JSON.stringify({
      status: 'fail',
      message: 'Buku gagal dihapus. Id tidak ditemukan',
    }));
    return;
  }

  books.splice(index, 1);

  res.writeHead(200, { 'Content-Type': 'application/json' });
  res.end(JSON.stringify({
    status: 'success',
    message: 'Buku berhasil dihapus',
  }));
};

module.exports = {
  addBookHandler,
  getAllBooksHandler,
  getBookByIdHandler,
  editBookByIdHandler,
  deleteBookByIdHandler,
};
