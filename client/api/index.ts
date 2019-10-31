import { DataTypeFromQueryPair } from './DataType'
import {
  TypeApiControllerRootObject,
  TypeApiControllerRootObjectQuery,
  TypeVote
} from './types'

export async function fetchAPI<Q extends TypeApiControllerRootObjectQuery>(query: Q):
  Promise<DataTypeFromQueryPair<TypeApiControllerRootObject, Q>> {
  const response = await post('/api', { query })
  return await response.json()
}

async function destroy(path: string) {
  return await fetch(path, {
    method: 'DELETE',
    credentials: 'include'
  })
}

async function post(path: string, data?: any) {
  return await fetch(path, {
    method: 'POST',
    credentials: 'include',
    body: JSON.stringify(data)
  })
}

type NewQuestionRequest = {
  description: string
  codes: { fileName: string; code: string }[]
}

export const question = {
  async create(request: NewQuestionRequest) {
    const response = await post('questions', request)
    return await response.json()
  },
  async resolve(questionId: number) {
    await post(`/questions/${questionId}/resolve`)
  },
  async destroy(questionId: number) {
    await destroy(`/questions/${questionId}`)
  },
  async read(questionId: number) {
    await post(`questions/${questionId}/read`)
  },
  async vote(questionId: number, value: TypeVote['value'] | null) {
    await post(`/questions/${questionId}/vote`, { value: value })
  }
}
export const comment = {
  async create(questionId: number, content: string, pos?: { codeId: number; lineNumber: number }) {
    const response = await post('/comments', { questionId, content, ...pos })
    return await response.json()
  },
  async update(commentId: number, content: string) {
    await post(`/comments/${commentId}`, { content })
  },
  async destroy(commentId: number) {
    await destroy(`/comments/${commentId}`)
  },
  async vote(commentId: number, value: TypeVote['value'] | null) {
    await post(`/comments/${commentId}/vote`, { value: value })
  }
}
