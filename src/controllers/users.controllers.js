import { pool } from '../db.js'

/**
 * Este método permite validar si el usuario existe, en caso de no existir lo
 * crea y en cualquier caso, crea el registro del prestamo del libro
 */
export const createUser = async (req, res) => {
  const { identification, name, lastname } = req.body.user
  const { bookId, library, home } = req.body.book

  const response = { message: '' }

  try {
    const userExists = await pool.query('SELECT * FROM users WHERE identification = ?', [identification])

    let userId = 0
    let saved = true

    if (!userExists[0][0]) {
      const [ rows ] = await pool.query(
        'INSERT INTO users(identification,name,lastname) VALUES (?, ?, ?)',
        [identification, name, lastname],
      )

      userId = rows.insertId
    } else {
      userId = userExists[0][0].id

      if(home) {
        const canHome = await pool.query(
          'SELECT loan_home FROM users WHERE id = ?', [userId]
        )

        saved = canHome[0][0].loan_home
      }
    }

    if(saved) {
      const borrowed = await pool.query(
        'INSERT INTO borrowed_books(user_id,book_id,library,home) VALUES (?, ?, ?, ?)',
        [userId, bookId, library, home],
      )

      await pool.query(
        'UPDATE books SET is_borrowed = true WHERE id = ?', [bookId]
      )

      response.message = 'Tu solicitud se realizó con éxito'
    } else {
      response.message = 'No estás autorizado para llevar libros a casa'
    }

  } catch (error) {
    response.message = error.message
  }

  res.json(response)
}

/**
 * Método para obtener todos los usuarios de la base de datos
 */
export const getUsers = async (req, res) => {
  const [ rows ] = await pool.query('SELECT * FROM users')

  rows.sort((a, b) => {
    if(a.lastname < b.lastname) return -1
    if(a.lastname > b.lastname) return 1
    return 0
  })
  res.json(rows)
}

export const updateUser = async (req, res) => {
  const { id, permit } = req.body

  await pool.query(
    'UPDATE users SET loan_home = ? WHERE id = ?', [permit, id]
  )

  res.json({ message: 'El usuario ha sido actualizado con éxito' })
}
