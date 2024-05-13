import './App.css';
import Home from './Pages/Home';
import {BrowserRouter as Router} from 'react-router-dom'; // URL router

function App() {
  return (
    <Router>
      <div>
        <Home />
      </div>
    </Router>
  );
}

export default App;