import { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { getData } from "../utilities/fetch-utils";
import { SERVER_URL } from "../utilities/folder-utils";

function FileDisplay() {
  const navigate = useNavigate();
  const { file } = useParams();

  const [fileContent, setFileContent] = useState("");

  useEffect(() => {
    (async () => {
      try {
        const fileType = file.split(".")[1];
        const data = await getData(`${SERVER_URL}/${file}`, fileType);
        if (data instanceof Error) throw data;
        setFileContent(data);
      } catch (error) {
        navigate("/error");
      }
    })();
  }, [file]);

  return (
    <div className="file-display">
      <ul className="info-list">{fileContent}</ul>
    </div>
  );
}

export default FileDisplay;
