import logo from './logo.svg';
import './App.css';
import SignIn from './components/SignIn';
import RutasAnimadas from './components/RutasAnimadas';
import { BrowserRouter } from 'react-router-dom';

function App() {
  return (
    <div>
      <BrowserRouter>
        <RutasAnimadas/>
      </BrowserRouter>

    </div>
  );
}

export default App;
