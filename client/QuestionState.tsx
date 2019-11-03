import { createContext } from 'react'
import { DataTypeFromQueryPair } from '../api/DataType'
import { TypeQuestion } from '../api/types'

const query = {
  '*': true,
  codes: {
    '*': true,
    threads: {
      '*': true,
      comments: { '*': true, myVote: '*' }
    }
  },
  unreads: '*',
  questionComments: { '*': true, myVote: '*' }
} as const
type Comment = QuestionState['questionComments'][0]

type QuestionState = DataTypeFromQueryPair<TypeQuestion, typeof query>

function findAbsolutePath(obj: unknown, searchPath: string[], id: number): (string | number)[] | undefined {
  if (obj instanceof Array) {
    if (searchPath.length === 0) {
      const idx = obj.findIndex(o => o.id === id)
      if (idx >= 0) return [idx]
      return
    }
    for (let i = 0; i < obj.length; i++) {
      const el = obj[i]
      const path = findAbsolutePath(el, searchPath, id)
      if (path) return [i, ...path]
    }
  } else if (typeof obj === 'object' && obj) {
    const path = findAbsolutePath((obj as any)[searchPath[0]], searchPath.slice(1), id)
    if (path) return [searchPath[0], ...path]
  }
}

function updateIn<T>(state: T, paths: (string[])[], id: number, data: any): T {
  for (const path of paths) {
    const absolutePath = findAbsolutePath(state, path, id)
    if (!absolutePath) continue
    const state2 = { ...state }
    let s = state2 as any
    absolutePath.slice(0, -1).forEach(p => {
      if (s[p] instanceof Array) {
        s = s[p] = [...s[p]]
      } else {
        s = s[p] = { ...s[p] }
      }
    })
    const p = absolutePath[absolutePath.length - 1]
    s[p] = { ...s[p], ...data }
    return state2
  }
  return state
}
function updateComment(state: QuestionState, id: number, comment: Partial<Comment>): QuestionState {
  return updateIn(state, [['questionComments'], ['codes', 'threads', 'comments']], id, comment)
}
function updateComment(state: QuestionState, id: number, comment: Partial<Comment>): QuestionState {
  return updateIn(state, [['questionComments'], ['codes', 'threads', 'comments']], id, comment)
}
const actions = {
  updateComment
}

const QuestionPatchActionsContext = createContext<any>(null)
export function useQuestionPatchActions() {

}
