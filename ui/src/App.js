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
import ProjectWorkflows from '~/views/ProjectWorkflows'
import CreateProject from '~/views/CreateProject'
import Workflow from '~/views/Workflow'

export default function App() {
  return (
    <div className="App">
      <Router>
        <Switch>
          <Route path="/projects/new">
            <CreateProject />
          </Route>

          <Route path="/projects/:projectSlug/workflows/new">
            <Workflow />
          </Route>

          <Route path="/projects/:projectSlug/workflows/:workflowSlug">
            <Workflow />
          </Route>

          <Route path="/projects/:projectSlug">
            <ProjectWorkflows />
          </Route>

          <Route path="/">
            <Projects />
          </Route>
        </Switch>

      </Router>
    </div>
  );
}
