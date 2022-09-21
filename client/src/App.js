import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import "./App.css";
import Folder from "./pages/Folder";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/users">
          <Route index element={<Navigate to="joen" />} />
          <Route path="joen">
            <Route index element={<Navigate to="main" />} />
            <Route path=":folderId" element={<Folder />}>
              <Route path=":file/info" element={<div>Info</div>}/>
              <Route path=":file/display" element={<div>Show</div>}/>
            </Route>
          </Route>
        </Route>
        <Route path="/" element={<Navigate to="/users" />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
