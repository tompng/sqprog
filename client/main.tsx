import React, { useEffect, useState } from 'react'
import { render } from 'react-dom'
import { createBrowserHistory } from 'history'
import { Router, Route, Switch } from 'react-router-dom'
import { NewQuestionForm } from './question/NewQuestionForm'
import { QuestionView } from './question/QuestionView'
import { QuestionsView } from './question/QuestionsView'
import { applyRippleStyle } from './lib/ikachan'
import { CurrentUserContext, LastQuestionListUrlContext } from './context'
import { Header, PageBody } from './components/Header'
import { UnreadQuestionsView } from './question/UnreadQuestionsView'

const history = createBrowserHistory()

const NewQuestionView: React.FC = () => {
  return <>
    <Header current="new_question" title="いかちゃんにコードを送ろう" />
    <PageBody>
      <NewQuestionForm />
    </PageBody>
  </>
}

const NotFoundView: React.FC = () => {
  return <div>404 not found</div>
}

const Routes: React.FC<{ uid: string }> = ({ uid }) => {
  useEffect(() => {
    applyRippleStyle()
  }, [])
  const qlvalue = useState<string | null>(null)
  return (
    <CurrentUserContext.Provider value={uid}>
      <LastQuestionListUrlContext.Provider value={qlvalue}>
        <Router history={history}>
          <Switch>
            <Route path="/questions/" exact component={QuestionsView} />
            <Route path="/questions/new" exact component={NewQuestionView} />
            <Route path="/questions/:id(\d+)" exact component={QuestionView} />
            <Route path="/unreads" exact component={UnreadQuestionsView} />
            <Route component={NotFoundView} />
          </Switch>
        </Router>
      </LastQuestionListUrlContext.Provider>
    </CurrentUserContext.Provider>
  )
}
const el = document.getElementById('app')!
render(<Routes uid={el.getAttribute('data-uid')!} />, el)
