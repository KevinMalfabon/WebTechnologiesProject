import { useState } from 'react'
import type { AuthorModel, CreateAuthorModel, UpdateAuthorModel } from '../AuthorModel'
import axios from 'axios'

export const useAuthorProvider = () => {
  const [authors, setAuthors] = useState<AuthorModel[]>([])

  const loadAuthors = () => {
    axios
      .get('http://localhost:3000/authors')
      .then(response => {
        setAuthors(response.data)
      })
      .catch(err => console.error(err))
  }

  const createAuthor = (author: CreateAuthorModel) => {
    axios
      .post('http://localhost:3000/authors', author)
      .then(() => {
        loadAuthors()
      })
      .catch(err => console.error(err))
  }

  const updateAuthor = (id: string, input: UpdateAuthorModel) => {
    axios
      .patch(`http://localhost:3000/authors/${id}`, input)
      .then(() => {
        loadAuthors()
      })
      .catch(err => console.error(err))
  }

  const deleteAuthor = (id: string) => {
    axios
      .delete(`http://localhost:3000/authors/${id}`)
      .then(() => {
        loadAuthors()
      })
      .catch(err => console.error(err))
  }

  return { authors, loadAuthors, createAuthor, updateAuthor, deleteAuthor }
}
