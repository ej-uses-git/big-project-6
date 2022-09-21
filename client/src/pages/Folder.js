import { formatNames } from "../utilities/folder-utils";
import { postJSON, getJSON, getText } from "../utilities/fetch-utils";
import { useCallback, useEffect, useState } from "react";
import { Outlet, useNavigate, useParams } from "react-router-dom";
import ContextMenu from "../components/ContextMenu";

const _SERVER_URL = "http://10.0.0.55:3000/users/joen";

function Folder() {
  const navigate = useNavigate();
  const { folderId } = useParams();

  const [fileData, setFileData] = useState([]);
  const [anchorPoint, setAnchorPoint] = useState({ x: 0, y: 0 });
  const [showMenu, setShowMenu] = useState(false);
  const [hasContext, setHasContext] = useState();

  const handleContextMenu = useCallback(
    (event) => {
      event.preventDefault();
      setAnchorPoint({ x: event.pageX, y: event.pageY });
      setShowMenu(true);
      setHasContext(event.target.title);
    },
    [setAnchorPoint, setShowMenu, setHasContext]
  );

  const handleOptionSelect = async (event) => {
    const { title } = event.target;
    switch (title) {
      case "info":
        return navigate(`info/${hasContext}`);
      case "show":
        return navigate(`${hasContext}`);
      case "rename":
        const data = await postJSON(
          `${_SERVER_URL}/${hasContext}`,
          prompt("Enter a new file name.")
        );
        setFileData(data);
        break;
      case "delete":
        //
        break;
      case "copy":
        //
        break;
    }
  };

  const handleClick = useCallback(
    () => (showMenu ? setShowMenu(false) : null),
    [showMenu]
  );

  useEffect(() => {
    document.addEventListener("click", handleClick);
    return () => {
      document.removeEventListener("click", handleClick);
    };
  });

  useEffect(() => {
    (async () => {
      const data = await getJSON(_SERVER_URL);
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

      {}

      <table className="folder-contents">
        <thead className="folder-headings">
          <tr>
            <th>Name</th>
            <th>Type</th>
          </tr>
        </thead>
        <tbody className="folder-files">
          {fileNames.map((file, i) => (
            <tr key={file} className="folder-file">
              {file.map((text) => (
                <td
                  title={fileData[i]}
                  key={file + "--" + text}
                  onContextMenu={handleContextMenu}
                >
                  {text}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>

      <Outlet />
    </div>
  );
}

export default Folder;
