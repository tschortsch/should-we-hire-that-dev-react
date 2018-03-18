import React from 'react'
import {
  BrowserRouter as Router,
  Route
} from 'react-router-dom'
import App from './App'

const Root = () => (
  <Router>
    <div>
      <Route exact path="/" component={App}/>
      <Route path="/:username" component={App}/>
    </div>
  </Router>
)

export default Root
