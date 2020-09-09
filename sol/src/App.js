import React from 'react';
import './App.css';

class App extends React.Component {
  constructor(props){
    super(props);
    this.state={apiResponse:""};
  }

  

  async componentDidMount() {
    console.log("Success");
    await fetch('http://localhost:3000/api/courses')
                              .then(res => res.text())
                              .then(text => console.log(text));
    

  };

  render() {
    return (
      <div className="App">
        <p>{this.state.apiResponse}</p>
      </div>
    );
  }
}

export default App;
