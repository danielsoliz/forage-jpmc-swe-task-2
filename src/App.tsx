import React, { Component } from 'react';
import DataStreamer, { ServerRespond } from './DataStreamer';
import Graph from './Graph';
import './App.css';

/**
 * State declaration for <App />
 */
interface IState {
  data: ServerRespond[],
  showGraph: boolean,
}

/**
 * The parent element of the react app.
 * It renders title, button and Graph react element.
 */
class App extends Component<{}, IState> {
  constructor(props: {}) {
    super(props);

    this.state = {
      // data saves the server responds.
      // We use this state to parse data down to the child element (Graph) as element property
      data: [],
      showGraph: false,
    };
  }

  /**
   * Render Graph react component with state.data parse as property data
   */
  renderGraph() {
    //Ensure graph does not render until user clicks Start Streaming Button
    if (this.state.showGraph) {
      return (<Graph data={this.state.data}/>)
    }
   
  }

  /**
   * Get new data from server and update the state with the new data
   */
  getDataFromServer() {

    // Flag to determine whether to continue getting Data
    let continueFetching = true;
    // Fetch data every 100 milliseconds
    const fetchDataInterval = setInterval(() => {
      // Stop fetching if continueFetching is false
      if (!continueFetching) {
        clearInterval(fetchDataInterval);
        return;
      }
    
    // Fetch data
    DataStreamer.getData((serverResponds: ServerRespond[]) => {
      // Update the state by creating a new array of data that consists of
      // Previous data in the state and the new data from server
      this.setState({ data: [...this.state.data, ...serverResponds] });
    
      // Set continueFetching to False after 1000 requests
      if (this.state.data.length >= 1000) {
        continueFetching = false;
      }
    });
    }, 100); // Update every 100 milliseconds
  }

  /**
   * Render the App react component
   */
  render() {
    return (
      <div className="App">
        <header className="App-header">
          Bank & Merge Co Task 2
        </header>
        <div className="App-content">
          <button className="btn btn-primary Stream-button"
            // when button is click, our react app tries to request
            // new data from the server.
            // As part of your task, update the getDataFromServer() function
            // to keep requesting the data every 100ms until the app is closed
            // or the server does not return anymore data.
            onClick={() => {
              // Render Graph when Start Streaming is clicked
              this.setState({showGraph: true});
              this.getDataFromServer()
              }}
            >
            Start Streaming Data
          </button>
          <div className="Graph">
            {this.renderGraph()}
          </div>
        </div>
      </div>
    )
  }
}

export default App;
