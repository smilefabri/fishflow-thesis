import React, { useEffect, useState } from "react";
import { Schema } from "../../../../../amplify/data/resource";
import { getUrl } from "aws-amplify/storage";
import { generateClient } from "aws-amplify/api";


interface analisiVideoFormComponentProps {
    onButtonBackEvent: (id: boolean) => void;
    infoVideoToAnalyze: Schema['Video']['type'];
    setShowSideBar: (value: boolean) => void;
}


const client = generateClient<Schema>();

export default function AnalisiVideoForm({ onButtonBackEvent, infoVideoToAnalyze, setShowSideBar }: analisiVideoFormComponentProps) {

    const [videoUrl, setVideoUrl] = useState<string | null>(null);
    const [nome, setNome] = useState('');
    const [descrizione, setDescrizione] = useState('');
    const [tipoOp, setTipoOp] = useState('DEFAULT');
    const validTipoOpDict: { [key: string]: string } = {
        DEFAULT: "Conteggi persone 👥",
        ALTRO: 'Altro 🧠',
    };


    setShowSideBar(false)

    useEffect(() => {

        const fetchVideoUrl = async () => {
            try {
                console.log("url: video prima", infoVideoToAnalyze.path)
                const decodeUrl = decodeURIComponent(infoVideoToAnalyze.path);
                console.log("url: video dopo", decodeUrl)
                const signedUrl = await getUrl({
                    path: decodeUrl
                });
                console.log("url: video", signedUrl.url.toString())
                setVideoUrl(signedUrl.url.toString());

            } catch (error) {
                console.error('Errore nel recupero dell\'URL del video:', error);
            }
        };

        fetchVideoUrl();
    }, []);




    async function PostNewAnalyzeEvent(e: React.FormEvent) {
        e.preventDefault();

        if (!nome || !tipoOp) {

            console.log("nome: ", nome);
            console.log("tipo Operazione: ", tipoOp);
            console.error("Tutti i campi sono obbligatori.");
            return;

        }




        console.log("nome: ", nome);
        console.log("descrizione ", descrizione);
        console.log("tipo Operazione: ", tipoOp);


        try {
            // todo implementare gli altri tutti gli argomenti


            if (tipoOp in validTipoOpDict) {
                const { data, errors } = await client.mutations.customCreateAnalisi({
                    name: nome,
                    videoId: infoVideoToAnalyze.id,
                    type_op: tipoOp,
                    arg: "",
                    descrizione: descrizione,

                });
                console.log("data: ", data);
                console.log("errors: ", errors);
            } else {
                console.error(`Ruolo '${tipoOp}' non valido.`);
            }

        } catch (error) {
            console.log('call failed: ', error);
        }

    }

    return (

        <>
            <div className="">
                <div className="h-12  px-2 mb-2 mx-1 flex items-center   bg-gray-50 shadow   ">
                    {/* Bottone "Indietro" con SVG */}
                    <button
                        onClick={() => {
                            setShowSideBar(true)
                            onButtonBackEvent(true)
                        }

                        }
                        className="hover:bg-gray-200    w-8 h-8 rounded flex items-center justify-center"
                        aria-label="Indietro"
                    >
                        <svg xmlns="http://www.w3.org/2000/svg" className="w-6 h-6 text-black" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                        </svg>
                    </button>
                </div>
                

                <div className="flex h-[calc(100vh-3rem)]">
                    {/* Video + controlli */}
                    <div className="flex-1 relative  flex flex-col">

                        {/* Video */}
                        <video className="mx-10 my-6  max-h-[80vh] object-contain border-4 border-gray-300 shadow-lg" controls>
                            {videoUrl ? (
                                <source src={videoUrl} type="video/mp4" />
                            ) : (
                                <p>Video non disponibile</p>
                            )}
                        </video>




                    </div>

                    {/* Right Panel */}
                    <div className="w-80 bg-gray-50  overflow-y-auto  shadow">
                        <form onSubmit={
                            (e) => {
                                PostNewAnalyzeEvent(e);
                                onButtonBackEvent(true)
                                setShowSideBar(true)
                            }
                        } className="flex flex-col h-full justify-between" >

                            <h3 className="text-lg text-center font-semibold text-gray-900 dark:text-white border-b pt-2 pb-3 mb-4">
                                Opzioni
                            </h3>
                            <div className="space-y-2 px-4">
                                <div className="grid gap-4 mb-4 sm:grid-cols-1">
                                    <div>
                                        <label
                                            htmlFor="name"
                                            className="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
                                        >
                                            Name
                                        </label>
                                        <input
                                            type="text"
                                            name="name"
                                            id="name"
                                            onChange={(e) => setNome(e.target.value)}
                                            className="bg-white  border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-primary-500 dark:focus:border-primary-500"
                                            placeholder="Ex. Apple iMac 27“"
                                        />
                                    </div>
                                    <div className="sm:col-span-2">
                                        <label htmlFor="description" className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Description</label>
                                        <textarea onChange={(e) => setDescrizione(e.target.value)} id="description" className="block h-52 resize-none p-2.5 w-full text-sm text-gray-900 bg-white rounded-lg border border-gray-300 focus:ring-primary-500 focus:border-primary-500 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-primary-500 dark:focus:border-primary-500" placeholder="Write a description..." />
                                    </div>

                                    <div>
                                        <label
                                            htmlFor="tipo"
                                            className="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
                                        >
                                            Tipo Analisi
                                        </label>
                                        <select
                                            defaultValue={validTipoOpDict.DEFAULT}
                                            onChange={
                                                (e) => {
                                                    console.log("descrizione debug:", e.target.value);
                                                    setTipoOp(e.target.value);
                                                }
                                            }
                                            id="category"
                                            className="bg-gray-50 text-center border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-primary-500 focus:border-primary-500 block w-full p-2.5  dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-primary-500 dark:focus:border-primary-500"
                                        >

                                            {
                                                Object.entries(validTipoOpDict).map(([key, value], index) => (
                                                    <option key={index} value={key} >{value}</option>
                                                ))}


                                        </select>
                                    </div>
                                </div>
                            </div>

                            <button className="inline-flex items-center justify-center mt-auto m-7   bg-blue-600 text-white rounded-lg py-2  hover:bg-blue-700">
                                Submit Analysis

                                <svg className="w-5 h-5 ms-2 text-white dark:text-white " aria-hidden="true" xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="none" viewBox="0 0 24 24">
                                    <path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 11.917 9.724 16.5 19 7.5" />
                                </svg>

                            </button>
                        </form>

                    </div>
                </div>


            </div>
        </>
    );
}