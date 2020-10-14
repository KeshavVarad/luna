import React from 'react';
import './App.css';
import Home from './components/Home';
import Courses from './components/Courses';
import Assignments from './components/Assignments';
import Profile from './components/Profile';
import { BrowserRouter as Router, Switch, Route } from 'react-router-dom';

function App() {
  return (
    <Router>
      <div className="App">
        <Switch>
          <Route path="/" exact component={Home} />
          <Route path="/assignments" component={Assignments} />
          <Route path="/courses" component={Courses} />
          <Route path="/profile" component={Profile} />
        </Switch>
      </div>
    </Router>
  )
}

export default App;
