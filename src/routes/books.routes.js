import { Router } from 'express'
import { addBook, deleteBorrow, getBooks, getBorrowedBooks } from '../controllers/books.controllers.js'

const router = Router()

router.get('/books', getBooks)
router.get('/books_borrowed', getBorrowedBooks)
router.delete('/books_borrowed', deleteBorrow)
router.post('/books', addBook)

export default router
