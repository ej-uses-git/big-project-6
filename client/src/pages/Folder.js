import { formatNames, getURL } from "../utilities/folder-utils";
import {
  deleteFile,
  getData,
  postJSON,
  renameFile,
  postFile,
} from "../utilities/fetch-utils";
import { useCallback, useEffect, useRef, useState } from "react";
import { Outlet, useNavigate, useResolvedPath } from "react-router-dom";
import ContextMenu from "../components/ContextMenu";
import DeleteConfirm from "../components/DeleteConfirm";
import NewName from "../components/NewName";
import FileInfo from "./FileInfo";
import FileDisplay from "./FileDisplay";
import cache from "../utilities/cache.json";
import CreateFile from "../components/CreateFile";

function Folder() {
  const navigate = useNavigate();
  const { pathname } = useResolvedPath();

  const folderContent = useRef(cache);

  const [showInfo, setShowInfo] = useState();
  const [showDisplay, setShowDisplay] = useState();
  const [showCreate, setShowCreate] = useState(false);
  const [fileData, setFileData] = useState([]);
  const [anchorPoint, setAnchorPoint] = useState({ x: 0, y: 0 });
  const [showMenu, setShowMenu] = useState(false);
  const [hasContext, setHasContext] = useState();
  const [selected, setSelected] = useState();
  const [deleteState, setDeleteState] = useState({ active: false, confirm: 0 });
  const [renameState, setRenameState] = useState({ active: false, name: "" });
  const [copyState, setCopyState] = useState({ active: false, name: "" });
  const [createState, setCreateState] = useState({ active: false, body: {} });

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
        setShowInfo(true);
        setShowDisplay(false);
        return navigate(`${pathname}/${hasContext}/info`);
      case "show":
        setShowDisplay(true);
        setShowInfo(false);
        return navigate(`${pathname}/${hasContext}`);
      case "rename":
        setRenameState({ active: true, name: "" });
        break;
      case "delete":
        setDeleteState({ active: true, confirm: 0 });
        break;
      case "copy":
        setCopyState({ active: true, name: "" });
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
    const afterPeriod = pathname.split(".");
    setShowDisplay(afterPeriod.length > 1);
    setShowInfo(pathname.endsWith("info"));
    setCreateState({
      active: showCreate,
      body: {},
    });
  }, [pathname]);

  useEffect(() => {
    if (showDisplay || showInfo) return;
    (async () => {
      try {
        setFileData([]);
        const data = await getData(getURL(pathname), "json");
        setFileData(data);
        folderContent.current = data;
      } catch (error) {
        navigate("/error");
      }
    })();
  }, [pathname, showDisplay, showInfo]);

  useEffect(() => {
    if (!deleteState.confirm) return;
    (async () => {
      const data = await deleteFile(`${getURL(pathname)}/${hasContext}`);
      setFileData(data);
      folderContent.current = data;
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
      folderContent.current = data;
    })();
  }, [renameState.name]);

  useEffect(() => {
    if (!copyState.name) return;
    (async () => {
      const data = await postJSON(
        `${getURL(pathname)}/${hasContext}`,
        copyState.name + `.${hasContext.split(".")[1]}`
      );
      setFileData(data);
      folderContent.current = data;
    })();
  }, [copyState.name]);

  useEffect(() => {
    if (!createState.body.type) return;
    (async () => {
      const data = await postFile(
        `${getURL(pathname)}/${createState.body.newName}.${
          createState.body.type
        }`,
        createState.body.content,
        createState.body.type
      );
      setFileData(data);
      folderContent.current = data;
    })();
  }, [createState.body]);

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

      {!showDisplay && !showInfo && (
        <div className="folder-display">
          <div className="folder-title">Welcome! Here is your folder.</div>

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
                            setShowDisplay(true);
                            return navigate(`${pathname}/${fileData[i]}`);
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
      )}

      {!showCreate && (
        <button
          onClick={() => {
            setCreateState({ active: true, body: {} });
            setShowCreate(true);
          }}
        >
          Create new file
        </button>
      )}

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

      {showCreate && (
        <CreateFile
          onSubmit={(value) => {
            setCreateState({ active: false, body: value });
            setShowCreate(false);
          }}
          onClickout={() => {
            setCreateState({ active: false, body: "" });
          }}
        />
      )}

      {showInfo && <FileInfo />}

      {showDisplay && !showInfo && <FileDisplay />}
    </div>
  );
}

export default Folder;

/* 
<Route index element={<NavigateDatatype />} />
<Route path="info" element={<FileInfo />} />
*/
