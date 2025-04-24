const { addBookHandler, getAllBooksHandler, getBookDetailHandler, updateBookHandler, deleteBookHandler } = require('./handler');

const routes = (req, res) => {
  const { method, url } = req;
  const idPattern = /^\/books\/([\w-]+)$/;

  if (method === 'POST' && url === '/books') return addBookHandler(req, res);
  if (method === 'GET' && url === '/books') return getAllBooksHandler(req, res);

  const match = url.match(idPattern);
  if (match) {
    const bookId = match[1];
    if (method === 'GET') return getBookDetailHandler(req, res, bookId);
    if (method === 'PUT') return updateBookHandler(req, res, bookId);
    if (method === 'DELETE') return deleteBookHandler(req, res, bookId);
  }

  res.writeHead(404, { 'Content-Type': 'application/json' });
  res.end(JSON.stringify({ status: 'fail', message: 'Route not found' }));
};

module.exports = { routes };
