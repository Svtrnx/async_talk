import {Routes, Route } from 'react-router-dom';
import Signup from './components/signup/signup';
import Signin from './components/signin/signin';
import Messenger from './components/messenger/messenger';

function App() {

  return (
      <Routes>
        <Route path="/signin" element={<Signin />} />
        <Route path="/" element={<Signin />} />
        <Route path="/signup" element={<Signup />} />
        <Route path="/messenger" element={<Messenger />}/>
      </Routes>
  );
}

export default App;
