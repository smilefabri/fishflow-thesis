import { useState } from "react";
import { Routes, Route} from 'react-router-dom';
import SideBarUserComponent from "../module/home/user/sideBarUser";
import ContextUSerDashboard from "../module/home/user/ContextUserDashboard/contextUserDashboard";
import ContextUserVideo from "../module/home/user/contextUserVideo/contextUserVideo";
import ContentUseranalyze from "../module/home/user/contextUserAnalisi/contextUserAnalisi";

export default function UserHome() {
  //const { context } = useParams(); // Ottieni il parametro 'context' dall'URL
  const [showSidebar, setShowSidebar] = useState(true);
  
    



  
  
    /*   
    const handleSidebarSelect = (newContext:string) => {
    const navigate = useNavigate();
    navigate(`/user/${newContext}`); // Aggiorna l'URL quando un elemento della sidebar è selezionato
    }; 
  

  */

    
  return (
    <div className="flex">
      {showSidebar && <SideBarUserComponent/>}
      <div className="flex-1">
        <Routes>
          <Route path="/" element={<ContextUSerDashboard />} /> {/* Route per /user/ o /user/home */}
          <Route path="home" element={<ContextUSerDashboard />} /> {/* Alias per la home */}
          <Route path="video" element={<ContextUserVideo setShowSideBar={setShowSidebar} />} />
          <Route path="analisi" element={<ContentUseranalyze setShowSideBar={setShowSidebar} />} />
          {/* Aggiungi altre route per i tuoi contesti */}
        </Routes>
      </div>
    </div>
  );
}