/* eslint-disable @typescript-eslint/no-unused-vars */
import { generateClient } from "aws-amplify/api";
import { Schema } from "../../../../../amplify/data/resource";
import { useEffect, useState } from "react";
import { downloadData, getUrl } from "aws-amplify/storage";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { convertiInGMA } from "../../../../utils/helpers";
import { Link } from "react-router-dom";


interface analisiVideoFormComponentProps {
    onButtonBackEvent: (id: boolean) => void;
    infoVideoToAnalyze: Schema['Analisi']['type'];
    setShowSideBar: (value: boolean) => void;

}

interface videoInfo {
    id?: string
    name?: string
    path?: string
    size?: number | null
    updateAt?: string
}

type Point = { time: number; count: number };

const client = generateClient<Schema>();

export default function ContextUserAnalyzeForm({ onButtonBackEvent, infoVideoToAnalyze, setShowSideBar }: analisiVideoFormComponentProps) {

    const [videoInfo, setVideoInfo] = useState<videoInfo>()
    const [imageUrl, setImageUrl] = useState<string | undefined>();
    const [data, setDataUrl] = useState<Point[]>([]);

    const fetchImageUrl = async (url: string) => {
        try {
            //console.log("url: image", url)
            const decodeUrl = decodeURIComponent(url);
            //console.log("url: image dopo", decodeUrl)
            const signedUrl = await getUrl({
                path: decodeUrl,
            });

            //console.log("url: video", signedUrl.url.toString())
            setImageUrl(signedUrl.url.toString());

        } catch (error) {
            console.error('Errore nel recupero dell\'URL del video:', error);
        }
    };

    function formatTime(seconds: number): string {
        const hrs = Math.floor(seconds / 3600);
        const mins = Math.floor((seconds % 3600) / 60);
        const secs = Math.floor(seconds % 60);

        if (hrs > 0) {
            return `${hrs}:${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
        }
        return `${mins}:${secs.toString().padStart(2, '0')}`;
    }


    const fetchCharDatatUrl = async (url: string) => {
        try {
            console.log("url: image", url)
            const decodeUrl = decodeURIComponent(url);
            console.log("url: image dopo", decodeUrl)

            const response = await downloadData({
                path: decodeUrl
            }).result;

            const tempData = JSON.parse(await response.body.text())

            setDataUrl(tempData)
            console.log("data", data)

        } catch (error) {
            console.error('Errore nel recupero dell\'URL del video:', error);
        }
    };

    async function getDataVideo() {


        try {
            if (infoVideoToAnalyze.videoId) {

                const Id: string = infoVideoToAnalyze.id;
                const { data, errors } = await client.models.Analisi.get({
                    id: Id,

                },


                )

                if (errors) {
                    console.error("error:", errors)
                    return;
                }
                const videoResult = await data?.video();

                const cleanVideo: videoInfo = {
                    id: videoResult?.data?.id,
                    name: videoResult?.data?.name,
                    path: videoResult?.data?.path,
                    size: videoResult?.data?.size,
                    updateAt: videoResult?.data?.updatedAt,
                };

                setVideoInfo(cleanVideo);

                //setVideoInfo(videoResult?.data);
            }




        } catch (error) {
            console.error('An unexpected error occurred:', error);

        }
    }

    useEffect(() => {
        //console.log(infoVideoToAnalyze.result)
        if (typeof infoVideoToAnalyze.result === 'string') {
            const jsonObj = JSON.parse(infoVideoToAnalyze.result);
            //console.log(jsonObj['imageHeatMap']);

            fetchImageUrl(jsonObj['imageHeatMap'])
            fetchCharDatatUrl(jsonObj['chart'])

        } else {
            console.error("Il risultato non è una stringa valida");
        }
        setShowSideBar(false);
        getDataVideo();
    }, []);

    return (
        <>
            <div className="p-6 font-sans text-gray-900">
                <div className="flex flex-col lg:flex-row lg:space-x-6">
                    <div className="flex-1 space-y-6">
                        {/* Header info */}
                        <div className="flex flex-col space-y-3 space-x-3 items-start">
                            {/* Bottone "Indietro" con SVG */}

                            <div className="flex flex-row space-x-3">
                                <button

                                    onClick={() => {
                                        onButtonBackEvent(true)
                                        setShowSideBar(true)
                                    }

                                    }
                                    className="hover:bg-gray-200    w-8 h-8 rounded flex items-center justify-center"
                                    aria-label="Indietro"
                                >
                                    <svg xmlns="http://www.w3.org/2000/svg" className="w-6 h-6 text-black" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                                    </svg>
                                </button>

                                <nav className="flex" aria-label="Breadcrumb">
                                    <ol className="inline-flex items-center space-x-1 md:space-x-2 rtl:space-x-reverse">
                                        <Link onClick={()=>{
                                            setShowSideBar(true)
                                        }}
                                        to='/user' className="inline-flex items-center">
                                            <a href="#" className="inline-flex items-center text-sm font-medium text-gray-700 hover:text-blue-600 dark:text-gray-400 dark:hover:text-white">
                                                <svg className="w-3 h-3 me-2.5" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="currentColor" viewBox="0 0 20 20">
                                                    <path d="m19.707 9.293-2-2-7-7a1 1 0 0 0-1.414 0l-7 7-2 2a1 1 0 0 0 1.414 1.414L2 10.414V18a2 2 0 0 0 2 2h3a1 1 0 0 0 1-1v-4a1 1 0 0 1 1-1h2a1 1 0 0 1 1 1v4a1 1 0 0 0 1 1h3a2 2 0 0 0 2-2v-7.586l.293.293a1 1 0 0 0 1.414-1.414Z" />
                                                </svg>
                                                Home
                                            </a>
                                        </Link>
                                        <li>
                                            <div className="flex items-center">
                                                <svg className="rtl:rotate-180 w-3 h-3 text-gray-400 mx-1" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 6 10">
                                                    <path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="m1 9 4-4-4-4" />
                                                </svg>
                                                <span className="ms-1 text-sm font-medium text-gray-700 h dark:hover:text-white">Analisi</span>
                                            </div>
                                        </li>
                                        <li aria-current="page">
                                            <div className="flex items-center">
                                                <svg className="rtl:rotate-180 w-3 h-3 text-gray-400 mx-1" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 6 10">
                                                    <path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="m1 9 4-4-4-4" />
                                                </svg>
                                                <span className="ms-1 text-sm font-medium text-gray-500 md:ms-2 dark:text-gray-400">{infoVideoToAnalyze.name}</span>
                                            </div>
                                        </li>
                                    </ol>
                                </nav>
                            </div>

                            <div>
                                <h1 className="text-2xl font-bold">{infoVideoToAnalyze.name}</h1>
                                <div className="flex items-center space-x-2 mt-2 text-sm">

                                    <span className="px-2 py-1 bg-blue-100 text-blue-700 rounded text-xs font-medium">id: {infoVideoToAnalyze.id}</span>
                                    <span className="px-2 py-1 bg-green-100 text-green-700 rounded text-xs font-medium">data: {convertiInGMA(infoVideoToAnalyze.createdAt)}</span>
                                </div>
                            </div>



                        </div>

                        <hr className="border-gray-200" />

                        <div className="flex flex-row space-x-5">
                            <div className="flex flex-col space-y-4 basis-2/3">
                                {/* Video section */}
                                <div className="bg-white shadow rounded-lg overflow-hidden">
                                    <div className="px-4 py-4 border-b">
                                        <h2 className="text-lg font-semibold">{videoInfo?.name}</h2>
                                        <span className="px-2 mt-1 py-1 bg-blue-100 text-blue-700 rounded text-xs font-medium">id: {videoInfo?.id}</span>


                                    </div>
                                    <div className="p-4">
                                        <img
                                            src={imageUrl}

                                            className="w-full rounded"
                                        ></img>
                                        <div className="flex justify-between items-end mt-4">
                                            <div className="flex space-x-4 text-sm">
                                                <div>
                                                    <label className="block mb-1 font-medium">Speed</label>
                                                    <select className="border rounded px-3 py-1 w-24">
                                                        <option>Normal</option>
                                                    </select>
                                                </div>
                                                <div>
                                                    <label className="block mb-1 font-medium">Camera</label>
                                                    <select className="border rounded px-3 py-1 w-24">
                                                        <option>Main</option>
                                                    </select>
                                                </div>
                                            </div>
                                            <div>
                                                <label className="block mb-1 text-sm font-medium">Offset Time</label>
                                                <div className="flex space-x-1">
                                                    <input className="w-12 border rounded text-center" defaultValue="00" />
                                                    <span className="text-sm">:</span>
                                                    <input className="w-12 border rounded text-center" defaultValue="00" />
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                                {/* Eventi section */}
                                <div className="bg-white shadow rounded-lg p-4">
                                    <h3 className="text-lg font-semibold mb-2">Eventi</h3>
                                    <div className="space-y-4 text-sm">
                                        <div>
                                            <p className="font-medium">03:06:20 - Succede qualcosa</p>
                                        </div>
                                        <div className="font-semibold text-red-600">
                                            03:06:20 - errore
                                        </div>
                                        <div className="flex space-x-2 mt-2">
                                            <button className="border border-gray-300 px-3 py-1 rounded hover:bg-gray-100">Flag Impact</button>
                                            <button className="bg-black text-white px-3 py-1 rounded hover:bg-gray-900">Finish Review</button>
                                            <button className="flex items-center border border-gray-300 px-3 py-1 rounded hover:bg-gray-100">
                                                <svg xmlns="http://www.w3.org/2000/svg" className="w-4 h-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="1.5">
                                                    <path strokeLinecap="round" strokeLinejoin="round" d="M12 4.5v15m7.5-7.5h-15" />
                                                </svg>
                                                Esporta
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            </div>
                            {/* Aside summary */}
                            <aside className="flex flex-col basis-1/3 w-full lg:w-72 shrink-0 bg-white shadow rounded-lg p-4 mt-6 lg:mt-0 space-y-4 h-fit">
                                <h2 className="text-lg text-left my-3 font-semibold">Persone</h2>

                                <div className="text-sm space-y-2">
                                    <div className="w-full h-64">
                                        <ResponsiveContainer width="100%" height="100%">
                                            <LineChart data={data} margin={{ top: 10, right: 30, left: 0, bottom: 10 }}>
                                                <defs>
                                                    <linearGradient id="colorCount" x1="0" y1="0" x2="0" y2="1">
                                                        <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.8} />
                                                        <stop offset="95%" stopColor="#3b82f6" stopOpacity={0} />
                                                    </linearGradient>
                                                </defs>
                                                <CartesianGrid strokeDasharray="3 3" stroke="#ddd" />
                                                <XAxis
                                                    dataKey="time"
                                                    tick={{ fontSize: 12 }}
                                                    tickFormatter={formatTime}
                                                    label={{ value: "Tempo", offset: -10, position: "insideBottom" }}
                                                />
                                                <YAxis
                                                    tick={{ fontSize: 12 }}
                                                    label={{ value: "Persone", angle: -90, position: "insideLeft" }}
                                                />
                                                <Tooltip
                                                    contentStyle={{ backgroundColor: "#f5f5f5", borderRadius: "10px" }}
                                                    labelFormatter={(label) => `Tempo: ${formatTime(label as number)}`}
                                                    formatter={(value) => [`${value} persone`, "Numero"]}
                                                />
                                                <Legend

                                                    align="right"
                                                    iconType="line" // o "line", "square"
                                                    wrapperStyle={{ fontSize: 13 }}
                                                    margin={{ top: 20, right: 40, left: 20, bottom: 20 }}
                                                />
                                                <Line
                                                    type="basis"
                                                    dataKey="count"
                                                    stroke="#3b82f6"
                                                    strokeWidth={2}
                                                    dot={{ r: 3 }}
                                                    activeDot={{ r: 6 }}
                                                    fillOpacity={1}
                                                    fill="url(#colorCount)"
                                                />
                                            </LineChart>
                                        </ResponsiveContainer>
                                    </div>
                                </div>
                                <hr className="border-gray-200" />

                            </aside>
                        </div>

                    </div>

                </div>
            </div>


        </>
    );
}