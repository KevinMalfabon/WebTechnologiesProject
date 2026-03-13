import { useState } from 'react'
import type { AuthorModel } from '../AuthorModel'

export const useAuthorDetailsProvider = (id: string) => {
  const [isLoading, setIsLoading] = useState(false)
  const [author, setAuthor] = useState<AuthorModel | null>(null)

  const loadAuthor = () => {
    setIsLoading(true)
    fetch(`http://localhost:3000/authors/${id}`)
      .then(response => response.json())
      .then(data => setAuthor(data))
      .finally(() => setIsLoading(false))
  }

  return { isLoading, author, loadAuthor }
}
