import UserVideoTable from "./contextUserVideo.table";
import AnalisiVideoForm from "./contextAnalisiVideo";
import { useEffect, useState } from "react";
import { Schema } from "../../../../../amplify/data/resource";

interface UserVideoComponentProps{
    setShowSideBar: (value:boolean)=> void;
}

export default function ContextUserVideo({setShowSideBar}:UserVideoComponentProps) {

    const [onToggleSwitch, setOnToggleSwitch] = useState(true);
    const [infoVideoToAnalyzeData, setinfoVideoToAnalyzeData] = useState<Schema['Video']['type']>();



    useEffect(()=>{
        setShowSideBar(true)
    },[])
    // todo aggiornare la lista in real-time

    return (

        <>
            {onToggleSwitch ? <UserVideoTable  managerRowInfoVideo={setinfoVideoToAnalyzeData} changeToAnalisiComponent={setOnToggleSwitch} /> : <AnalisiVideoForm setShowSideBar={setShowSideBar}  onButtonBackEvent={setOnToggleSwitch}  infoVideoToAnalyze={infoVideoToAnalyzeData as Schema['Video']['type']} />}
        
        </>


    );


}