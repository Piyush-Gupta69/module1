import { Route,Routes,BrowserRouter} from "react-router-dom"
import Login from "./Login.js"
import LocationChecker from "./LocationChecker";
function App() {
  return (
    <div>
      <BrowserRouter>
      <Routes>
        <Route element={<Login/>} path="/" exact/>
        <Route element={<LocationChecker/>} path="/LocationChecker" />

      </Routes>
      </BrowserRouter>
    </div>
      
  );
}

export default App;
