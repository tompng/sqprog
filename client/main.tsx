import React from 'react'
import { render } from 'react-dom'
import { createBrowserHistory } from 'history'
import { Router, Route, Switch, RouteProps } from 'react-router-dom'

const history = createBrowserHistory()

const NewQuestionView: React.FC = () => {
  return <div>hello</div>
}

const QuestionView: React.FC = () => {
  return <div>world</div>
}

const NotFoundView: React.FC = () => {
  return <div>404 not found</div>
}

const Routes: React.FC = () => {
  return (
    <Router history={history}>
      <Switch>
        <Route path="/questions/new" exact component={NewQuestionView} />
        <Route path="/questions/:id(\d+)" exact component={QuestionView} />
        <Route component={NotFoundView} />
      </Switch>
    </Router>
  )
}

render(<Routes />, document.getElementById('app'))
