// http://10.0.0.55:3000/:filename -> show, delete, rename, copy
// http://10.0.0.55:3000/:filename/info -> info

function ContextMenu({ anchorPoint, onOptionSelect }) {
  const { x, y } = anchorPoint;
  return (
    <ul className="menu" style={{ top: y, left: x }}>
      <li onClick={onOptionSelect} title="info">
        Info
      </li>
      <li onClick={onOptionSelect} title="show">
        Show
      </li>
      <li onClick={onOptionSelect} title="rename">
        Rename
      </li>
      <li onClick={onOptionSelect} title="delete">
        Delete
      </li>
      <li>Copy</li>
    </ul>
  );
}

export default ContextMenu;
