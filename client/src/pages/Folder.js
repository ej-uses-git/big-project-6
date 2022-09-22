import { formatNames, getURL } from "../utilities/folder-utils";
import {
  deleteFile,
  getData,
  postJSON,
  renameFile,
} from "../utilities/fetch-utils";
import { useCallback, useEffect, useState } from "react";
import { Outlet, useNavigate, useResolvedPath } from "react-router-dom";
import ContextMenu from "../components/ContextMenu";
import DeleteConfirm from "../components/DeleteConfirm";
import NewName from "../components/NewName";

function Folder() {
  const navigate = useNavigate();
  const { pathname } = useResolvedPath();
  useEffect(() => {
  }, []);

  const [fileData, setFileData] = useState([]);
  const [anchorPoint, setAnchorPoint] = useState({ x: 0, y: 0 });
  const [showMenu, setShowMenu] = useState(false);
  const [hasContext, setHasContext] = useState();
  const [selected, setSelected] = useState();
  const [deleteState, setDeleteState] = useState({ active: false, confirm: 0 });
  const [renameState, setRenameState] = useState({ active: false, name: "" });
  const [copyState, setCopyState] = useState({ active: false, name: "" });

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
    let data, newName;
    switch (title) {
      case "info":
        return navigate(`${hasContext}/info`);
      case "show":
        return navigate(`${hasContext}`);
      case "rename":
        setRenameState({ active: true, name: "" });
        break;
      case "delete":
        setDeleteState({ active: true, confirm: 0 });
        break;
      case "copy":
        //TODO
        setCopyState({ active: true, name: "" });
        data = await postJSON(`${getURL(pathname)}/${hasContext}`, newName);
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
      const data = await getData(getURL(pathname), "json");
      // const data = ["app.js", "examples", "b.txt"];
      setFileData(data);
    })();
  }, []);

  useEffect(() => {
    if (!deleteState.confirm) return;
    (async () => {
      const data = await deleteFile(`${getURL(pathname)}/${hasContext}`);
      setFileData(data);
    })();
  }, [deleteState.confirm]);

  useEffect(() => {
    if (!renameState.name) return;
    const fileType = hasContext.split(".")[1] || "";
    (async () => {
      const data = await renameFile(
        `${getURL(pathname)}/${hasContext}`,
        renameState.name + (fileType ? `.${fileType}` : "")
      );
      setFileData(data);
    })();
  }, [renameState.name]);

  useEffect(() => {
    if (!copyState.name) return;
    (async () => {
      const data = await postJSON(
        `${getURL(pathname)}/${hasContext}`,
        copyState.name
      );
      setFileData(data);
    })();
  }, [copyState.name]);

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
        <div className="folder-title">Welcome, Joen! Here is your folder.</div>

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
                        if (selected === fileData[i]) {
                          return navigate(`${fileData[i]}`);
                        }
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

      {deleteState.active && (
        <DeleteConfirm
          confirm={() => setDeleteState({ active: false, confirm: 1 })}
          deny={() => setDeleteState({ active: false, confirm: 0 })}
          onClickout={() => {
            setDeleteState({ active: false, confirm: 0 });
          }}
        />
      )}

      {renameState.active && (
        <NewName
          onSubmit={(value) => {
            setRenameState({ active: false, name: value });
          }}
          onClickout={() => {
            setRenameState({ active: false, name: "" });
          }}
        />
      )}

      {copyState.active && (
        <NewName
          onSubmit={(value) => {
            setCopyState({ active: false, name: value });
          }}
          onClickout={() => {
            setCopyState({ active: false, name: "" });
          }}
        />
      )}

      <Outlet />
    </div>
  );
}

export default Folder;
