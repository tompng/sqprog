import { createContext } from 'react'

export const CurrentUserContext = createContext('')
export const QuestionContext = createContext({ id: 0, reload: async () => {} })
export const CodeIdContext = createContext(0)
export const LineNumberContext = createContext(0)
