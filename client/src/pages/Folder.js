import { formatNames, SERVER_URL } from "../utilities/folder-utils";
import {
  deleteFile,
  getData,
  postJSON,
  renameFile,
} from "../utilities/fetch-utils";
import { useCallback, useEffect, useState } from "react";
import { Outlet, useNavigate, useParams } from "react-router-dom";
import ContextMenu from "../components/ContextMenu";

function Folder() {
  const navigate = useNavigate();
  const { folderId } = useParams();

  const [fileData, setFileData] = useState([]);
  const [anchorPoint, setAnchorPoint] = useState({ x: 0, y: 0 });
  const [showMenu, setShowMenu] = useState(false);
  const [hasContext, setHasContext] = useState();
  const [selected, setSelected] = useState();

  const handleContextMenu = useCallback(
    (event) => {
      event.preventDefault();
      setAnchorPoint({ x: event.pageX, y: event.pageY });
      setShowMenu(true);
      setHasContext(event.target.title);
      setSelected(event.target.title);
    },
    [setAnchorPoint, setShowMenu, setHasContext]
  );

  const handleOptionSelect = async (event) => {
    const { title } = event.target;
    const fileType = hasContext.split(".")[1] || "";
    let data, newName;
    switch (title) {
      case "info":
        return navigate(`info/${hasContext}`);
      case "show":
        return navigate(`${hasContext}`);
      case "rename":
        newName = prompt("Enter a new file name.");
        if (!newName) return;
        data = await renameFile(
          `${SERVER_URL}/${hasContext}`,
          newName + "." + fileType
        );
        setFileData(data);
        break;
      case "delete":
        const userSure = window.confirm("Are you sure? This cannot be undone!");
        if (!userSure) return;
        data = await deleteFile(`${SERVER_URL}/${hasContext}`);
        setFileData(data);
        break;
      case "copy":
        //TODO
        newName = prompt("Enter a new file name.");
        if (!newName) return;
        data = await postJSON(`${SERVER_URL}/${hasContext}`, newName);
        break;
    }
  };

  const handleClick = useCallback(
    (e) => {
      if (showMenu) setShowMenu(false);
      if (e.target.tagName === "BODY") setSelected(null);
    },
    [showMenu, selected]
  );

  useEffect(() => {
    document.addEventListener("click", handleClick);
    return () => {
      document.removeEventListener("click", handleClick);
    };
  });

  useEffect(() => {
    (async () => {
      const data = await getData(SERVER_URL, "json");
      // const data = ["app.js", "examples", "b.txt"];
      setFileData(data);
    })();
  }, []);

  const fileNames = formatNames(fileData);
  return (
    <div className="folder">
      {showMenu && (
        <ContextMenu
          onOptionSelect={handleOptionSelect}
          anchorPoint={anchorPoint}
          onContext={handleContextMenu}
        />
      )}

      <div className="folder-display">
        <div className="folder-title">
          Welcome, Joen! Here is your {folderId} folder.
        </div>

        <div className="table-holder">
          <table className="folder-contents">
            <thead className="folder-headings">
              <tr>
                <th className="name-head">Name</th>
                <th className="type-head">Type</th>
              </tr>
            </thead>
            <tbody className="folder-files">
              {fileNames.map((file, i) => (
                <tr key={file} className="folder-file">
                  {file.map((text) => (
                    <td
                      title={fileData[i]}
                      key={file + "--" + text}
                      className={selected === fileData[i] ? "selected" : ""}
                      onClick={(e) => {
                        if (selected === fileData[i])
                          return navigate(`${fileData[i]}`);
                        setSelected(fileData[i]);
                      }}
                      onContextMenu={handleContextMenu}
                    >
                      {text}
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      <Outlet />
    </div>
  );
}

export default Folder;
