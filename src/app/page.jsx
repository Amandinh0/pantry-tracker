import Image from "next/image";
import styles from "./page.module.css";
import ItemList from "./components/ItemList";

export default function Home() {
  return (
    
    <div>
      <h1>Pantry Tracker</h1>
      <ItemList/>
    </div>
  );
}
