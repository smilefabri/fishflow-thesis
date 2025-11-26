import { useState } from "react";
import SideBarAdminComponent from "../module/home/admin/sideBarAdmin";
import ContentAdminDashboard from "../module/home/admin/contextAdminDashboard";
import ContentUserList from "../module/home/admin/contextAdminManagerUser";


export default function AdimnHome() {

    const [selected, setSelected] = useState('home');

    function renderContent() {
        
        console.log('change to :', selected);

        switch (selected) {

            case 'home':
                return <ContentAdminDashboard />

            case 'users':
                return <ContentUserList />
            default:
                break;
        }
    }

    return (
        <>
            <SideBarAdminComponent onSelect={setSelected} />
            {renderContent()}
        </>

    );
}