import { pool } from '../db.js'

/**
 * Método para obtener todos los libros de la base de datos
 */
export const getBooks = async (req, res) => {
  const [ rows ] = await pool.query('SELECT * FROM books')

  rows.sort((a, b) => {
    if(a.name < b.name) return -1
    if(a.name > b.name) return 1
    return 0
  })
  res.json(rows)
}

/**
 * Método para devolver un listado de los libros prestados
 */
export const getBorrowedBooks = async (req, res) => {
  const [ rows ] = await pool.query(
    `SELECT
      borrowed_books.id AS 'id',
      books.id AS id_book,
      books.name AS title,
      CONCAT(users.name, ' ', users.lastname) AS 'borrowed_to',
      CASE
          WHEN borrowed_books.home = 1 THEN 'Casa'
          WHEN borrowed_books.library = 1 THEN 'Biblioteca'
          ELSE 'Desconocido'
      END AS 'read_in'
    FROM
      books
    INNER JOIN
      borrowed_books ON books.id = borrowed_books.book_id
    INNER JOIN
      users ON users.id = borrowed_books.user_id
    ORDER BY books.name ASC;`
  )

  res.json(rows)
}

/**
 * Método para agregar un nuevo libro a la base de datos
 */
export const addBook = async (req, res) => {
  const {
    name,
    author,
    publisher,
    year,
    genre,
  } = req.body

  const [ rows ] = await pool.query(
    'INSERT INTO books(name,author,publisher,year,genre) VALUES (?, ?, ?, ?, ?)',
    [name, author, publisher, year, genre],
  )

  res.json({ id: rows.insertId, name })
}

/**
 * Este método permite eliminar el registro de los libros prestado
 */
export const deleteBorrow = async (req, res) => {
  const { id, id_book } = req.query

  await pool.query('DELETE FROM borrowed_books WHERE id = ?', [id])
  await pool.query('UPDATE books SET is_borrowed = false WHERE id = ?', [id_book])

  res.json({ message: 'El libro ha sido devuelto con éxito' })
}
