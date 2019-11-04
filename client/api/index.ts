import { useState, useEffect, useCallback } from 'react'
import { DataTypeFromQueryPair } from './DataType'
import {
  TypeApiControllerRootObject,
  TypeApiControllerRootObjectAliasFieldQuery,
  TypeVote
} from './types'

type ExtractData<T> = T extends { data: infer D } ? D : T
export type DataTypeFromRootQuery<Q extends TypeApiControllerRootObjectAliasFieldQuery> =
  ExtractData<DataTypeFromQueryPair<TypeApiControllerRootObject, { data: Q }>>
  export type TypeRootQuery = TypeApiControllerRootObjectAliasFieldQuery


function csrfToken() {
  return document.querySelector('meta[name="csrf-token"]')!.getAttribute('content')
}

export async function fetchData<Q extends TypeApiControllerRootObjectAliasFieldQuery>(query: Q):
  Promise<DataTypeFromRootQuery<Q>> {
  const response = await post('/api', { query })
  return await response.json()
}

type UseFetchedStateResult<T> = [T, (arg: T | ((t: T) => T)) => void, () => Promise<undefined>]
export function useFetchedState<Q extends TypeApiControllerRootObjectAliasFieldQuery>(query: Q):
  UseFetchedStateResult<DataTypeFromRootQuery<Q> | null> {
  const [state, setState] = useState<null | object>(null)
  const reload = useCallback(async () => {
    const data = await fetchData(query)
    setState(data)
  }, [])
  useEffect(() => {
    let aborted = false
    ;(async () => {
      const data = await fetchData(query)
      if (!aborted) setState(data)
    })()
    return () => { aborted = true }
  }, [])
  return [state, setState, reload] as any
}


async function destroy(path: string) {
  return await post(path, {}, 'DELETE')
}

async function patch(path: string, data?: any) {
  return await post(path, data, 'PATCH')
}

async function post(path: string, data?: any, method?: any) {
  return await fetch(path, {
    method: method || 'POST',
    credentials: 'include',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({...data, authenticity_token: csrfToken() })
  })
}

type NewQuestionRequest = {
  description: string
  mode: 'normal' | 'terrible'
  codes: { fileName: string; code: string }[]
}

export const question = {
  async create(request: NewQuestionRequest) {
    const response = await post('/questions', request)
    return await response.json() as { id: number }
  },
  async resolve(questionId: number, resolved: boolean) {
    await post(`/questions/${questionId}/resolve`, { resolved })
  },
  async destroy(questionId: number) {
    await destroy(`/questions/${questionId}`)
  },
  async read(questionId: number) {
    await post(`/questions/${questionId}/read`)
  },
  async vote(questionId: number, value: TypeVote['value'] | null) {
    await post(`/questions/${questionId}/vote`, { value: value })
  }
}
export const comment = {
  async create(questionId: number, content: string, pos?: { codeId: number; lineNumber: number }) {
    const response = await post('/comments', { questionId, content, ...pos })
    return await response.json() as { id: number }
  },
  async update(commentId: number, content: string) {
    await patch(`/comments/${commentId}`, { content })
  },
  async destroy(commentId: number) {
    await destroy(`/comments/${commentId}`)
  },
  async vote(commentId: number, value: TypeVote['value'] | null) {
    await post(`/comments/${commentId}/vote`, { value: value })
  }
}
