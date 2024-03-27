import { Login, Welcome, Signup } from "./pages";

import { BrowserRouter, Routes, Route } from "react-router-dom";
import RequireAuth from "./components/RequireAuth";

const App = () => (
  <div>
    <BrowserRouter>
      <Routes>
        {/* to make signup page a starter one */}
        <Route path="/" element={<Signup />} />

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
