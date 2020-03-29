import React from 'react'
import {
  BrowserRouter as Router,
  Switch,
  Route
} from "react-router-dom"
import axios from 'axios'
import './App.css'
import YAML from 'yaml'
import WorkflowEditor from '~/components/WorkflowEditor'
import Projects from '~/views/Projects'
import Project from '~/views/Project'

export default function App() {
  return (
    <div className="App">
      <Router>
        <Switch>
          <Route path="/projects/:path">
            <Project />
          </Route>

          <Route path="/">
            <Projects />
          </Route>
        </Switch>

      </Router>
    </div>
  );
}
