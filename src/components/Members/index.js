import "./style.css";
const Members = ({ members }) => {
  return (
    <ul className="members">
      {members.map((mem) => (
        <li tabIndex={"0"} key={mem.id}>
          <span>{mem.name}</span>
        </li>
      ))}
    </ul>
  );
};
export default Members;
