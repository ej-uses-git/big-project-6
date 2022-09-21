import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import "./App.css";
import FileDisplay from "./pages/FileDisplay";
import FileInfo from "./pages/FileInfo";
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
              <Route path="info/:file" element={<FileInfo />} />
              <Route path=":file" element={<FileDisplay />} />
            </Route>
          </Route>
        </Route>
        <Route path="/" element={<Navigate to="/users" />} />
        <Route path="*" element={<div>ERROR</div>} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
