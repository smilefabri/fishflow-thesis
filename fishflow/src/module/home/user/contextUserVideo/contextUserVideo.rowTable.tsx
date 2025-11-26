import { useEffect, useRef, useState } from "react";
import { Schema } from "../../../../../amplify/data/resource";
import { Nullable } from "@aws-amplify/data-schema";
import { convertiInGMA } from "../../../../utils/helpers";
import Modal from 'react-modal';
import DeleteVideo from "./contextUserVideo.deleteVideo";
interface TableRowComponentProps {
    infoVideo: Schema['Video']['type']
    isOpenDropDown: boolean;
    onToggleSwitchToAnalisiVideo: (value: boolean) => void,
    onToggleDropdown: (id: string) => void;
    formatBytes: (bytes?: Nullable<number>, decimals?: number) => string;
    managerRowInfoVideo: (value: Schema['Video']['type']) => void,

}


Modal.setAppElement('#root');


export default function TableRowComp({
    managerRowInfoVideo,
    infoVideo,
    isOpenDropDown,
    onToggleSwitchToAnalisiVideo,
    onToggleDropdown,
    formatBytes,

}: TableRowComponentProps) {


    function getFilenameWithoutExtensionFromName(filename: string): string {
        const parts = filename.split('.');
        if (parts.length <= 1) {
            return filename; // Non c'è estensione
        }
        parts.pop(); // Rimuove l'ultima parte (l'estensione)
        return parts.join('.'); // Ricongiunge le parti rimanenti
    }


    const [isOpenModalDeleteRow, setIsOpenModalDeleteRow] = useState(false)
    const dropdownRef = useRef<HTMLDivElement | null>(null); // Riferimento al dropdown
    const buttonRef = useRef<HTMLDivElement | null>(null); // Riferimento al bottone di attivazione

    // Funzione per chiudere il dropdown se si clicca fuori
    const handleClickOutside = (event: MouseEvent) => {
        if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node) && !buttonRef.current?.contains(event.target as Node)) {
            onToggleDropdown(infoVideo.id); // Chiude il dropdown se si clicca fuori
        }
    };

    // Aggiungi e rimuovi l'event listener
    useEffect(() => {
        document.addEventListener('mousedown', handleClickOutside);
        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, [onToggleDropdown, infoVideo.id]);


    return (
        <tr onDoubleClick={
            () => {
                managerRowInfoVideo(infoVideo);
                onToggleSwitchToAnalisiVideo(false);
            }

        } className="bg-white border-b hover:cursor-pointer dark:bg-gray-800 dark:border-gray-700 border-gray-200 hover:bg-gray-50 dark:hover:bg-gray-600">
            <td className="w-4 p-4">
                <div className="flex items-center">
                    <input
                        id={infoVideo.id}
                        type="checkbox"
                        className="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 rounded-sm focus:ring-blue-500 dark:focus:ring-blue-600 dark:ring-offset-gray-800 dark:focus:ring-offset-gray-800 focus:ring-2 dark:bg-gray-700 dark:border-gray-600"
                    />
                    <label className="sr-only">
                        checkbox
                    </label>
                </div>
            </td>
            <th
                scope="row"
                className="flex items-center px-6 py-4 text-gray-900 whitespace-nowrap dark:text-white"
            >
                <svg
                    className="w-6 h-6 fill-current text-blue-600 dark:text-white"
                    aria-hidden="true"
                    xmlns="http://www.w3.org/2000/svg"
                    width="24"
                    height="24"
                    fill="currentColor"
                    viewBox="0 0 24 24"
                >
                    <path
                        fillRule="evenodd"
                        d="M9 7V2.221a2 2 0 0 0-.5.365L4.586 6.5a2 2 0 0 0-.365.5H9Zm2 0V2h7a2 2 0 0 1 2 2v16a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V9h5a2 2 0 0 0 2-2Zm-2 4a2 2 0 0 0-2 2v2a2 2 0 0 0 2 2h2a2 2 0 0 0 2-2v-2a2 2 0 0 0-2-2H9Zm0 2h2v2H9v-2Zm7.965-.557a1 1 0 0 0-1.692-.72l-1.268 1.218a1 1 0 0 0-.308.721v.733a1 1 0 0 0 .37.776l1.267 1.032a1 1 0 0 0 1.631-.776v-2.984Z"
                        clipRule="evenodd"
                    />
                </svg>


                <div className="ps-3">
                    <div className="text-base font-medium">{getFilenameWithoutExtensionFromName(infoVideo.name)}</div>
                </div>


            </th>
            <td className="px-6 py-4">descrizione...</td>
            <td className="px-6 py-4">
                <div className="flex items-center">{convertiInGMA(infoVideo.updatedAt)}</div>
            </td>
            <td className="px-6 py-4">{formatBytes(infoVideo.size)}</td>

            <td className="px-6 py-4">
                <div ref={buttonRef} onClick={() => {
                    onToggleDropdown(infoVideo.id);
                    //

                }} className="flex flex-shrink-0 items-center justify-center hover:bg-gray-200 h-7 w-7 rounded-full   ">
                    <svg
                        className="w-6 h-6 cursor-pointer  text-gray-800 dark:text-white transition transform hover:scale-110 duration-300"
                        aria-hidden="true"
                        xmlns="http://www.w3.org/2000/svg"
                        width="24"
                        height="24"
                        fill="none"
                        viewBox="0 0 24 24"
                    >
                        <path
                            stroke="currentColor"
                            strokeLinecap="round"
                            strokeWidth="3"
                            d="M12 6h.01M12 12h.01M12 18h.01"
                        />

                    </svg>
                </div>
                {/* Dropdown Menu */}
                {isOpenDropDown && (
                    <>
                        {/* Dropdown menu */}
                        <div
                            ref={dropdownRef}
                            className="absolute right-3 border border-gray-300 bg-white divide-y z-20 divide-gray-100 rounded-lg shadow-sm w-44 dark:bg-gray-700 dark:divide-gray-600"
                        >
                            <ul
                                className="py-2 text-sm text-gray-700 dark:text-gray-200"
                                aria-labelledby="dropdownMenuIconButton"
                            >
                                <li className="px-2 mb-1.5">
                                    <button
                                        onClick={() => {
                                            managerRowInfoVideo(infoVideo);
                                            onToggleSwitchToAnalisiVideo(false);
                                        }
                                        }
                                        className="inline-flex items-center justify-center  text-white hover:bg-blue-500 bg-blue-600 focus:outline-none focus:ring-4 focus:ring-blue-100 font-medium rounded-lg text-sm px-3 py-1.5  dark:bg-gray-800 dark:text-gray-400 dark:border-gray-600 dark:hover:bg-gray-700 dark:hover:border-gray-600 dark:focus:ring-gray-700 w-full text-left"
                                        type="button"
                                    >
                                        <svg className="w-5 h-5  text-white dark:text-white" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="none" viewBox="0 0 24 24">
                                            <path fill="currentColor" d="M9.98189 4.50602c1.24881-.67469 2.78741-.67469 4.03621 0l3.9638 2.14148c.3634.19632.6862.44109.9612.72273l-6.9288 3.60207L5.20654 7.225c.2403-.22108.51215-.41573.81157-.5775l3.96378-2.14148ZM4.16678 8.84364C4.05757 9.18783 4 9.5493 4 9.91844v4.28296c0 1.3494.7693 2.5963 2.01811 3.2709l3.96378 2.1415c.32051.1732.66011.3019 1.00901.3862v-7.4L4.16678 8.84364ZM13.009 20c.3489-.0843.6886-.213 1.0091-.3862l3.9638-2.1415C19.2307 16.7977 20 15.5508 20 14.2014V9.91844c0-.30001-.038-.59496-.1109-.87967L13.009 12.6155V20Z" />
                                        </svg>

                                        <span className="sr-only ml-2">Action button</span>
                                        Analisi

                                    </button>
                                </li>
                                <li>
                                    <a
                                        href="#"
                                        className="block px-4 py-2 hover:bg-gray-100 dark:hover:bg-gray-600 dark:hover:text-white"
                                    >
                                        Edit
                                    </a>
                                </li>
                            </ul>
                            <div className="py-2 rounded-lg m-1">
                                <button
                                    onClick={()=> setIsOpenModalDeleteRow(true)}
                                    className="block mx-1 px-2 py-2 text-sm rounded-lg hover:text-white text-gray-700  hover:bg-red-300 dark:hover:bg-gray-600 dark:text-gray-200 dark:hover:text-white"
                                >
                                    Delete
                                </button>
                                <Modal
                                    isOpen={isOpenModalDeleteRow}
                                    onRequestClose={() => setIsOpenModalDeleteRow(false)}
                                    className="z-[99999] p-6 rounded shadow-lg w-1/3 mx-auto "
                                    overlayClassName="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-[9999]"
                                >

                                    <DeleteVideo />

                                </Modal>
                            </div>
                        </div>
                    </>

                )}
            </td>
        </tr>
    );
}
