import React, { useEffect } from 'react'
import { render } from 'react-dom'
import { createBrowserHistory } from 'history'
import { Router, Route, Switch } from 'react-router-dom'
import { NewQuestionForm } from './question/NewQuestionForm'
import { QuestionView } from './question/QuestionView'
import { QuestionsView } from './question/QuestionsView'
import { applyRippleStyle } from './lib/ikachan'
import { CurrentUserContext } from './context'
const history = createBrowserHistory()

const NewQuestionView: React.FC = () => {
  return <NewQuestionForm />
}

const NotFoundView: React.FC = () => {
  return <div>404 not found</div>
}

const Routes: React.FC<{ uid: string }> = ({ uid }) => {
  useEffect(() => {
    applyRippleStyle()
  }, [])
  return (
    <CurrentUserContext.Provider value={uid}>
      <Router history={history}>
        <Switch>
          <Route path="/questions/" exact component={QuestionsView} />
          <Route path="/questions/new" exact component={NewQuestionView} />
          <Route path="/questions/:id(\d+)" exact component={QuestionView} />
          <Route component={NotFoundView} />
        </Switch>
      </Router>
    </CurrentUserContext.Provider>
  )
}
const el = document.getElementById('app')!
render(<Routes uid={el.getAttribute('data-uid')!} />, el)
