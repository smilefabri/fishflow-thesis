import { useEffect, useRef } from "react";
import { Schema } from "../../../../../amplify/data/resource";


interface TableRowComponentProps {
    infoAnalyze: Schema['Analisi']['type']
    isOpenDropDown: boolean;
    onToggleSwitchToAnalisiVideo: (value: boolean) => void,
    onToggleDropdown: (id: string) => void;
    managerRowInfoVideo: (value: Schema['Analisi']['type']) => void,
}

export default function TableRowComp({
    managerRowInfoVideo,
    infoAnalyze,
    isOpenDropDown,
    onToggleSwitchToAnalisiVideo,
    onToggleDropdown,

}: TableRowComponentProps) {


    const dropdownRef = useRef<HTMLDivElement | null>(null); // Riferimento al dropdown
    const buttonRef = useRef<HTMLDivElement | null>(null); // Riferimento al bottone di attivazione

    // Funzione per chiudere il dropdown se si clicca fuori
    const handleClickOutside = (event: MouseEvent) => {
        if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node) && !buttonRef.current?.contains(event.target as Node)) {
          onToggleDropdown(infoAnalyze.id);
        }
      };

    // Aggiungi e rimuovi l'event listener
    useEffect(() => {
        document.addEventListener('mousedown', handleClickOutside); // Ascolta i click (mousedown è più reattivo)
        return () => {
          document.removeEventListener('mousedown', handleClickOutside); // Pulisci l'event listener quando il componente viene smontato
        };
      }, [onToggleDropdown, infoAnalyze.id]);


    return (
        <tr onDoubleClick={
            ()=>{
                if(infoAnalyze.status === 'FINISHED' ){
                    managerRowInfoVideo(infoAnalyze);
                    onToggleSwitchToAnalisiVideo(false);
                }
            }
        } className="bg-white border-b  hover:cursor-pointer dark:bg-gray-800 dark:border-gray-700 border-gray-200 hover:bg-gray-50 dark:hover:bg-gray-600">
            <td className="w-4 p-4">
                <div className="flex items-center">
                    <input
                        id={infoAnalyze.id}
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

                <svg className="w-6 h-6 text-blue-600 dark:text-white" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="currentColor" viewBox="0 0 24 24">
                    <path fillRule="evenodd" d="M9 7V2.221a2 2 0 0 0-.5.365L4.586 6.5a2 2 0 0 0-.365.5H9Zm2 0V2h7a2 2 0 0 1 2 2v16a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V9h5a2 2 0 0 0 2-2Zm-1 9a1 1 0 1 0-2 0v2a1 1 0 1 0 2 0v-2Zm2-5a1 1 0 0 1 1 1v6a1 1 0 1 1-2 0v-6a1 1 0 0 1 1-1Zm4 4a1 1 0 1 0-2 0v3a1 1 0 1 0 2 0v-3Z" clipRule="evenodd" />
                </svg>




                <div className="ps-3">
                    <div className="text-base font-semibold">{infoAnalyze.name}</div>
                </div>


            </th>
            <td className="px-6 py-4">descrizione...</td>
            <td className="px-6 py-4">
                <div className="flex items-center">
                    {infoAnalyze.status === "ONGOING" && (
                        <span className="inline-flex items-center bg-blue-100 text-blue-800 text-sm font-medium me-2 px-2.5 py-0.5 rounded-full dark:bg-blue-900 dark:text-blue-300">
                            in corso
                            <svg className="inline ml-1 w-3 h-3 text-gray-200 animate-spin dark:text-gray-600 fill-blue-600" viewBox="0 0 100 101" fill="none" xmlns="http://www.w3.org/2000/svg">
                                <path d="M100 50.5908C100 78.2051 77.6142 100.591 50 100.591C22.3858 100.591 0 78.2051 0 50.5908C0 22.9766 22.3858 0.59082 50 0.59082C77.6142 0.59082 100 22.9766 100 50.5908ZM9.08144 50.5908C9.08144 73.1895 27.4013 91.5094 50 91.5094C72.5987 91.5094 90.9186 73.1895 90.9186 50.5908C90.9186 27.9921 72.5987 9.67226 50 9.67226C27.4013 9.67226 9.08144 27.9921 9.08144 50.5908Z" fill="currentColor" />
                                <path d="M93.9676 39.0409C96.393 38.4038 97.8624 35.9116 97.0079 33.5539C95.2932 28.8227 92.871 24.3692 89.8167 20.348C85.8452 15.1192 80.8826 10.7238 75.2124 7.41289C69.5422 4.10194 63.2754 1.94025 56.7698 1.05124C51.7666 0.367541 46.6976 0.446843 41.7345 1.27873C39.2613 1.69328 37.813 4.19778 38.4501 6.62326C39.0873 9.04874 41.5694 10.4717 44.0505 10.1071C47.8511 9.54855 51.7191 9.52689 55.5402 10.0491C60.8642 10.7766 65.9928 12.5457 70.6331 15.2552C75.2735 17.9648 79.3347 21.5619 82.5849 25.841C84.9175 28.9121 86.7997 32.2913 88.1811 35.8758C89.083 38.2158 91.5421 39.6781 93.9676 39.0409Z" fill="currentFill" />
                            </svg>
                        </span>

                    )}
                    {infoAnalyze.status === "FAILED" && (
                        <span className="inline-flex items-center bg-red-100 text-red-800 text-sm font-medium me-2 px-2.5 py-0.5 rounded-full dark:bg-red-900 dark:text-red-300">
                            Red
                        </span>

                    )}
                    {infoAnalyze.status === "STARTED" && (
                        <span className="inline-flex items-center bg-blue-100 text-blue-800 text-sm font-medium me-2 px-2.5 py-0.5 rounded-full dark:bg-blue-900 dark:text-blue-300">
                            inziato
                        </span>

                    )}
                    {infoAnalyze.status === "FINISHED" && (

                        <span className="inline-flex items-center  bg-green-100 text-green-800 text-sm font-medium me-2 px-2.5 py-0.5 rounded-full dark:bg-green-900 dark:text-green-300">
                            Finito
                        </span>



                    )}
                </div>

            </td>
            <td className="px-6 py-4">{infoAnalyze.type}</td>

            <td className="px-6 py-4">
                <div ref={buttonRef} onClick={() => {
                    onToggleDropdown(infoAnalyze.id);
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
                                <li className="px-2">
                                    {infoAnalyze.status === "FINISHED" && (
                                        <button
                                            onClick={() => {
                                                managerRowInfoVideo(infoAnalyze);
                                                onToggleSwitchToAnalisiVideo(false);
                                            }
                                            }
                                            className="inline-flex items-center justify-center  text-white hover:bg-blue-500 bg-blue-600 focus:outline-none focus:ring-4 focus:ring-blue-100 font-medium rounded-lg text-sm px-3 py-1.5  dark:bg-gray-800 dark:text-gray-400 dark:border-gray-600 dark:hover:bg-gray-700 dark:hover:border-gray-600 dark:focus:ring-gray-700 w-full text-left"
                                            type="button"
                                        >


                                            <span className="sr-only mr-2">Action button</span>
                                            Open
                                            <svg className="w-5 h-5 ml-1  text-white dark:text-white" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="currentColor" viewBox="0 0 24 24">
                                                <path fillRule="evenodd" d="M11 4.717c-2.286-.58-4.16-.756-7.045-.71A1.99 1.99 0 0 0 2 6v11c0 1.133.934 2.022 2.044 2.007 2.759-.038 4.5.16 6.956.791V4.717Zm2 15.081c2.456-.631 4.198-.829 6.956-.791A2.013 2.013 0 0 0 22 16.999V6a1.99 1.99 0 0 0-1.955-1.993c-2.885-.046-4.76.13-7.045.71v15.081Z" clipRule="evenodd" />
                                            </svg>

                                        </button>
                                    )}
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
                            <div className="py-2">
                                <a
                                    href="#"
                                    className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 dark:hover:bg-gray-600 dark:text-gray-200 dark:hover:text-white"
                                >
                                    Delete
                                </a>
                            </div>
                        </div>
                    </>




                )}
            </td>
        </tr>
    );
}
