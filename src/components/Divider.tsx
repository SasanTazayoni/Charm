import { GiFleurDeLys } from "react-icons/gi";

export default function Divider() {
  return (
    <div className="divider">
      <div className="divider-line" />
      <GiFleurDeLys size={32} className="divider-icon" />
      <div className="divider-line" />
    </div>
  );
}
