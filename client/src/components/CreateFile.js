import { useState } from "react";
import { useClickout } from "../utilities/react-utils";

function CreateFile(props) {
  const vanish = useClickout("", props.onClickout);
  const [newName, setNewName] = useState("");
  const [content, setContent] = useState("");
  const [type, setType] = useState("txt");
  const [valid, setValid] = useState(true);

  return (
    <div className={"create-file" + (vanish ? " disappear" : "")}>
      <form
        onSubmit={(e) => {
          e.preventDefault();
          const info = { newName, content, type };
          switch (type) {
            case "txt":
              info.content = { content };
              break;
            case "json":
              try {
                JSON.parse(content);
              } catch (error) {
                alert("EHHHHh");
                return setValid(false);
              }
              break;
            default:
              return;
          }
          props.onSubmit(info);
        }}
      >
        <div className="new-name-holder">
          <label htmlFor="new-name-input">Enter a new name:</label>
          <input
            type="text"
            name="newName"
            id="new-name-input"
            value={newName}
            required
            onChange={(e) => {
              setNewName(e.target.value);
            }}
          />
        </div>

        <select
          name="type"
          id="type"
          value={type}
          onChange={(e) => {
            setType(e.target.value);
          }}
        >
          <option value="txt">txt</option>
          <option value="json">json</option>
        </select>

        <div className="content-holder">
          <label htmlFor="content-input">Enter file content:</label>
          <textarea
            name="content"
            id="content-input"
            onChange={(e) => {
              setContent(e.target.value);
            }}
            defaultValue={content}
          ></textarea>
        </div>
        <button type="submit">CONFIRM</button>
      </form>
    </div>
  );
}

export default CreateFile;
