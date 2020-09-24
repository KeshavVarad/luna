import React from 'react';
import './App.css';
import Home from './components/Home';
import Courses from './components/Courses';
import Assignments from './components/Assignments';
import { BrowserRouter as Router, Switch, Route } from 'react-router-dom';

function App() {
  return (
    <Router>
      <div className="App">
        <Switch>
          <Route path="/" exact component={Home} />
          <Route path="/assignments" component={Assignments} />
          <Route path="/courses" component={Courses} />

        </Switch>
      </div>
    </Router>
  )
}

export default App;
