import React, { Component } from "react";
import "./App.css";

// Import components
import Navbar from "./components/layout/Navbar";
import Footer from "./components/layout/Footer";
import Landing from "./components/layout/Landing";

class App extends Component {
  render() {
    return (
      <div className="App">
        {/* <h1>My React app</h1> */}
        <Navbar />
        <Landing />
        <Footer />
      </div>
    );
  }
}

export default App;
