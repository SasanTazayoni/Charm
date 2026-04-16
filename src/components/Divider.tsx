import { GiFleurDeLys } from "react-icons/gi";

export default function Divider() {
  return (
    <div className="divider">
      <div className="divider-line" />
      <GiFleurDeLys size={32} className="divider-icon" aria-hidden="true" />
      <div className="divider-line" />
    </div>
  );
}
