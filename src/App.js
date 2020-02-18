import React, { Component } from 'react';
import Helmet from 'helmet';
import AppRouter from "./shared/router";

class App extends Component {
  render(){
    return (
      <div className="App">
          <Helmet>
            <title>Signpost CRM</title>
          </Helmet>
          <AppRouter/>
      </div>    
    );
  }
}

export default App;
