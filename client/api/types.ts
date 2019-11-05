// auto generated by `rake api_types:generate`
type NonAliasQuery = true | string | string[] | ({ field?: undefined } & { [key: string]: any })
export interface TypeApiControllerQuestionCollection {
  total: number
  limit: number
  offset: number
  collection: (TypeQuestion [])
  _meta?: { name: 'ApiControllerQuestionCollection'; query: TypeApiControllerQuestionCollectionQueryBase }
}

export interface TypeApiControllerRootObject {
  question: TypeQuestion
  comment: TypeComment
  unreads: TypeUnread
  questions: TypeApiControllerQuestionCollection
  _meta?: { name: 'ApiControllerRootObject'; query: TypeApiControllerRootObjectQueryBase }
}

export interface TypeCode {
  id: number
  fileName: string
  code: string
  lines: number
  createdAt: string
  threads: (TypeCodeThread [])
  _meta?: { name: 'Code'; query: TypeCodeQueryBase }
}

export interface TypeCodeThread {
  id: number
  lineNumber: number
  createdAt: string
  comments: (TypeComment [])
  _meta?: { name: 'CodeThread'; query: TypeCodeThreadQueryBase }
}

export interface TypeComment {
  id: number
  uid: string
  content: string
  edited: boolean
  createdAt: string
  voteSummary: { up: (number | null); down: (number | null); forward: (number | null); rotate: (number | null) }
  myVote: TypeVote
  _meta?: { name: 'Comment'; query: TypeCommentQueryBase }
}

export interface TypeQuestion {
  id: number
  uid: string
  mode: ("normal" | "terrible")
  title: string
  description: string
  resolved: boolean
  createdAt: string
  questionComments: (TypeComment [])
  codes: (TypeCode [])
  commentCount: number
  unreads: (TypeUnread [])
  voteSummary: { up: (number | null); down: (number | null); forward: (number | null); rotate: (number | null) }
  myVote: TypeVote
  _meta?: { name: 'Question'; query: TypeQuestionQueryBase }
}

export interface TypeUnread {
  id: number
  uid: string
  time: string
  questionId: number
  _meta?: { name: 'Unread'; query: TypeUnreadQueryBase }
}

export interface TypeVote {
  id: number
  uid: string
  createdAt: string
  value: ("up" | "down" | "forward" | "rotate")
  _meta?: { name: 'Vote'; query: TypeVoteQueryBase }
}

export type TypeApiControllerQuestionCollectionQuery = TypeApiControllerQuestionCollectionStandaloneFields | Readonly<TypeApiControllerQuestionCollectionStandaloneFields[]>
  | (
    { [key in keyof TypeApiControllerQuestionCollectionQueryBase]?: key extends '*' ? true : TypeApiControllerQuestionCollectionQueryBase[key] | TypeApiControllerQuestionCollectionAliasFieldQuery }
    & { [key: string]: TypeApiControllerQuestionCollectionAliasFieldQuery | NonAliasQuery }
  )
export type TypeApiControllerQuestionCollectionStandaloneFields = 'total' | 'limit' | 'offset' | 'collection' | '*'
export type TypeApiControllerQuestionCollectionAliasFieldQuery =
  | { field: 'total' }
  | { field: 'limit' }
  | { field: 'offset' }
  | { field: 'collection'; query?: TypeQuestionQuery }

export interface TypeApiControllerQuestionCollectionQueryBase {
  total: true
  limit: true
  offset: true
  collection: true | TypeQuestionQuery | { field: never; query?: TypeQuestionQuery }
  '*': true
}

export type TypeApiControllerRootObjectQuery = TypeApiControllerRootObjectStandaloneFields | Readonly<TypeApiControllerRootObjectStandaloneFields[]>
  | (
    { [key in keyof TypeApiControllerRootObjectQueryBase]?: key extends '*' ? true : TypeApiControllerRootObjectQueryBase[key] | TypeApiControllerRootObjectAliasFieldQuery }
    & { [key: string]: TypeApiControllerRootObjectAliasFieldQuery | NonAliasQuery }
  )
export type TypeApiControllerRootObjectStandaloneFields = 'unreads'
export type TypeApiControllerRootObjectAliasFieldQuery =
  | { field: 'question'; query?: TypeQuestionQuery; params: { id: number } }
  | { field: 'comment'; query?: TypeCommentQuery; params: { id: number } }
  | { field: 'unreads'; query?: TypeUnreadQuery }
  | { field: 'questions'; query?: TypeApiControllerQuestionCollectionQuery; params: { mode: ("all" | "mine" | "resolved" | "unresolved"); limit: number; offset: number } }

export interface TypeApiControllerRootObjectQueryBase {
  question: { field: never; query?: TypeQuestionQuery; params: { id: number } }
  comment: { field: never; query?: TypeCommentQuery; params: { id: number } }
  unreads: true | TypeUnreadQuery | { field: never; query?: TypeUnreadQuery }
  questions: { field: never; query?: TypeApiControllerQuestionCollectionQuery; params: { mode: ("all" | "mine" | "resolved" | "unresolved"); limit: number; offset: number } }
}

export type TypeCodeQuery = TypeCodeStandaloneFields | Readonly<TypeCodeStandaloneFields[]>
  | (
    { [key in keyof TypeCodeQueryBase]?: key extends '*' ? true : TypeCodeQueryBase[key] | TypeCodeAliasFieldQuery }
    & { [key: string]: TypeCodeAliasFieldQuery | NonAliasQuery }
  )
export type TypeCodeStandaloneFields = 'id' | 'fileName' | 'code' | 'lines' | 'createdAt' | 'threads' | '*'
export type TypeCodeAliasFieldQuery =
  | { field: 'id' }
  | { field: 'fileName' }
  | { field: 'code' }
  | { field: 'lines' }
  | { field: 'createdAt' }
  | { field: 'threads'; query?: TypeCodeThreadQuery; params?: { limit?: number; order?: ({ [key: string]: ("asc" | "desc") } | "asc" | "desc") } }

export interface TypeCodeQueryBase {
  id: true
  fileName: true
  code: true
  lines: true
  createdAt: true
  threads: true | TypeCodeThreadQuery | { field: never; query?: TypeCodeThreadQuery; params?: { limit?: number; order?: ({ [key: string]: ("asc" | "desc") } | "asc" | "desc") } }
  '*': true
}

export type TypeCodeThreadQuery = TypeCodeThreadStandaloneFields | Readonly<TypeCodeThreadStandaloneFields[]>
  | (
    { [key in keyof TypeCodeThreadQueryBase]?: key extends '*' ? true : TypeCodeThreadQueryBase[key] | TypeCodeThreadAliasFieldQuery }
    & { [key: string]: TypeCodeThreadAliasFieldQuery | NonAliasQuery }
  )
export type TypeCodeThreadStandaloneFields = 'id' | 'lineNumber' | 'createdAt' | 'comments' | '*'
export type TypeCodeThreadAliasFieldQuery =
  | { field: 'id' }
  | { field: 'lineNumber' }
  | { field: 'createdAt' }
  | { field: 'comments'; query?: TypeCommentQuery; params?: { limit?: number; order?: ({ [key: string]: ("asc" | "desc") } | "asc" | "desc") } }

export interface TypeCodeThreadQueryBase {
  id: true
  lineNumber: true
  createdAt: true
  comments: true | TypeCommentQuery | { field: never; query?: TypeCommentQuery; params?: { limit?: number; order?: ({ [key: string]: ("asc" | "desc") } | "asc" | "desc") } }
  '*': true
}

export type TypeCommentQuery = TypeCommentStandaloneFields | Readonly<TypeCommentStandaloneFields[]>
  | (
    { [key in keyof TypeCommentQueryBase]?: key extends '*' ? true : TypeCommentQueryBase[key] | TypeCommentAliasFieldQuery }
    & { [key: string]: TypeCommentAliasFieldQuery | NonAliasQuery }
  )
export type TypeCommentStandaloneFields = 'id' | 'uid' | 'content' | 'edited' | 'createdAt' | 'voteSummary' | 'myVote' | '*'
export type TypeCommentAliasFieldQuery =
  | { field: 'id' }
  | { field: 'uid' }
  | { field: 'content' }
  | { field: 'edited' }
  | { field: 'createdAt' }
  | { field: 'voteSummary' }
  | { field: 'myVote'; query?: TypeVoteQuery }

export interface TypeCommentQueryBase {
  id: true
  uid: true
  content: true
  edited: true
  createdAt: true
  voteSummary: true
  myVote: true | TypeVoteQuery | { field: never; query?: TypeVoteQuery }
  '*': true
}

export type TypeQuestionQuery = TypeQuestionStandaloneFields | Readonly<TypeQuestionStandaloneFields[]>
  | (
    { [key in keyof TypeQuestionQueryBase]?: key extends '*' ? true : TypeQuestionQueryBase[key] | TypeQuestionAliasFieldQuery }
    & { [key: string]: TypeQuestionAliasFieldQuery | NonAliasQuery }
  )
export type TypeQuestionStandaloneFields = 'id' | 'uid' | 'mode' | 'title' | 'description' | 'resolved' | 'createdAt' | 'questionComments' | 'codes' | 'commentCount' | 'unreads' | 'voteSummary' | 'myVote' | '*'
export type TypeQuestionAliasFieldQuery =
  | { field: 'id' }
  | { field: 'uid' }
  | { field: 'mode' }
  | { field: 'title' }
  | { field: 'description' }
  | { field: 'resolved' }
  | { field: 'createdAt' }
  | { field: 'questionComments'; query?: TypeCommentQuery; params?: { limit?: number; order?: ({ [key: string]: ("asc" | "desc") } | "asc" | "desc") } }
  | { field: 'codes'; query?: TypeCodeQuery; params?: { limit?: number; order?: ({ [key: string]: ("asc" | "desc") } | "asc" | "desc") } }
  | { field: 'commentCount' }
  | { field: 'unreads'; query?: TypeUnreadQuery; params?: { limit?: number; order?: ({ [key: string]: ("asc" | "desc") } | "asc" | "desc") } }
  | { field: 'voteSummary' }
  | { field: 'myVote'; query?: TypeVoteQuery }

export interface TypeQuestionQueryBase {
  id: true
  uid: true
  mode: true
  title: true
  description: true
  resolved: true
  createdAt: true
  questionComments: true | TypeCommentQuery | { field: never; query?: TypeCommentQuery; params?: { limit?: number; order?: ({ [key: string]: ("asc" | "desc") } | "asc" | "desc") } }
  codes: true | TypeCodeQuery | { field: never; query?: TypeCodeQuery; params?: { limit?: number; order?: ({ [key: string]: ("asc" | "desc") } | "asc" | "desc") } }
  commentCount: true
  unreads: true | TypeUnreadQuery | { field: never; query?: TypeUnreadQuery; params?: { limit?: number; order?: ({ [key: string]: ("asc" | "desc") } | "asc" | "desc") } }
  voteSummary: true
  myVote: true | TypeVoteQuery | { field: never; query?: TypeVoteQuery }
  '*': true
}

export type TypeUnreadQuery = TypeUnreadStandaloneFields | Readonly<TypeUnreadStandaloneFields[]>
  | (
    { [key in keyof TypeUnreadQueryBase]?: key extends '*' ? true : TypeUnreadQueryBase[key] | TypeUnreadAliasFieldQuery }
    & { [key: string]: TypeUnreadAliasFieldQuery | NonAliasQuery }
  )
export type TypeUnreadStandaloneFields = 'id' | 'uid' | 'time' | 'questionId' | '*'
export type TypeUnreadAliasFieldQuery =
  | { field: 'id' }
  | { field: 'uid' }
  | { field: 'time' }
  | { field: 'questionId' }

export interface TypeUnreadQueryBase {
  id: true
  uid: true
  time: true
  questionId: true
  '*': true
}

export type TypeVoteQuery = TypeVoteStandaloneFields | Readonly<TypeVoteStandaloneFields[]>
  | (
    { [key in keyof TypeVoteQueryBase]?: key extends '*' ? true : TypeVoteQueryBase[key] | TypeVoteAliasFieldQuery }
    & { [key: string]: TypeVoteAliasFieldQuery | NonAliasQuery }
  )
export type TypeVoteStandaloneFields = 'id' | 'uid' | 'createdAt' | 'value' | '*'
export type TypeVoteAliasFieldQuery =
  | { field: 'id' }
  | { field: 'uid' }
  | { field: 'createdAt' }
  | { field: 'value' }

export interface TypeVoteQueryBase {
  id: true
  uid: true
  createdAt: true
  value: true
  '*': true
}
