import { Login, Welcome, Signup } from "./pages";

import { BrowserRouter, Routes, Route } from "react-router-dom";
import RequireAuth from "./components/RequireAuth";

const App = () => (
  <div>
    <BrowserRouter>
      <Routes>
        <Route path="/login" element={<Login />} />

        <Route element={<RequireAuth />}>
          <Route path="/welcome" element={<Welcome />} />
        </Route>

        <Route path="/signup" element={<Signup />} />
      </Routes>
    </BrowserRouter>
  </div>
);

export default App;
