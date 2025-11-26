import { useState } from "react";
import UserAnalyzeTable from "./contextUserAnalisi.table";
import { Schema } from "../../../../../amplify/data/resource";
import ContextUserAnalyzeForm from "./contextAnalisiComps";



interface UserAnalyzeComponentProps{
    setShowSideBar: (value:boolean)=> void;
}


export default function ContextUserAnalyze({setShowSideBar}:UserAnalyzeComponentProps) {
    const [onToggleSwitch, setOnToggleSwitch] = useState(true);
    const [infoVideoToAnalyzeData, setinfoVideoToAnalyzeData] = useState<Schema['Analisi']['type']>();

    // todo aggiornare la lista in real-time



    return (

        <>
            {onToggleSwitch ? <UserAnalyzeTable managerRowInfoVideo={setinfoVideoToAnalyzeData} changeToAnalisiComponent={setOnToggleSwitch} /> : <ContextUserAnalyzeForm setShowSideBar={setShowSideBar} onButtonBackEvent={setOnToggleSwitch} infoVideoToAnalyze={infoVideoToAnalyzeData as Schema['Analisi']['type']} />}

        </>

    );
}