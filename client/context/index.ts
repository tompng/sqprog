import { createContext } from 'react'

export const CurrentUserContext = createContext('')
export const QuestionContext = createContext({ id: 0, uid: '', reload: async () => {} })
export const CodeIdContext = createContext(0)
export const LineNumberContext = createContext(0)
export const LastQuestionListUrlContext = createContext<[string | null, (s: string | null) => void]>([null, () => {}])
export const UnreadCountContext = createContext({ count: 0, reload: async () => {} })
