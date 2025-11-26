import { useEffect, useState } from "react";
import TableRowComp from "./contextUserAnalisi.RowTable";
import Modal from 'react-modal';
import { generateClient } from "aws-amplify/api";
import { Schema } from "../../../../../amplify/data/resource";



Modal.setAppElement('#root');
const client = generateClient<Schema>();
const LOCAL_STORAGE_KEY = 'analisiList';



interface UserAnalyzeTableComponentProps {
    managerRowInfoVideo: (value: Schema['Analisi']['type']) => void,
    changeToAnalisiComponent: (id: boolean) => void;
}

export default function UserAnalyzeTable({ changeToAnalisiComponent, managerRowInfoVideo }: UserAnalyzeTableComponentProps) {

    const [isLoading, setIsLoading] = useState(true);
    const [listOfAnalyzes, setListOfAnalyzes] = useState<Array<Schema['Analisi']['type']>>([]);
    const [openDropdown, setOpenDropdown] = useState<string | null>(null); // Definiamo lo stato come number o null
    const handleDropdownToggle = (id: string) => {
        // Se il dropdown selezionato è già aperto, lo chiude, altrimenti lo apre
        setOpenDropdown(openDropdown === id ? null : id);
    };





    useEffect(() => {


        const storedAnalyzes = localStorage.getItem(LOCAL_STORAGE_KEY);
        if (storedAnalyzes) {
            try {
                setListOfAnalyzes(JSON.parse(storedAnalyzes));
                console.log("Dati caricati da localStorage.");
            } catch (error) {
                console.error("Errore nel parsing dei dati da localStorage:", error);
                // Se c'è un errore nel parsing, procedi con la fetch dal server
            } finally {
                setIsLoading(false); // Imposta isLoading a false anche se ci sono dati in locale
            }
        } else {
            setIsLoading(true); // Imposta isLoading a true solo se non ci sono dati in locale inizialmente
        }


        const subscriptionAnalyzesList = client.models.Analisi.observeQuery().subscribe({
            next: ({ items }) => {
                console.log("Dati aggiornati dal server Analisi:", items);
                setListOfAnalyzes([...items]); // Aggiorna la tabella automaticamente
                try {
                    localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(items));
                    console.log("Dati salvati in localStorage.");
                } catch (error) {
                    console.error("Errore nel salvataggio dei dati in localStorage:", error);
                }
                if (isLoading) {
                    setIsLoading(false); // Imposta isLoading a false dopo la prima fetch dal server
                }


            },
            error: (err) => {
                console.error("Errore nella subscription:", err);
                if (isLoading) {
                    setIsLoading(false); // Assicurati che isLoading sia gestito anche in caso di errore
                }
            },
        });

        return () => {
            subscriptionAnalyzesList.unsubscribe();
        }; // Cleanup della subscription
    }, []);




    return (

        <div className="p-4 sm:ml-64">
            <div className="flex items-center justify-between flex-column md:flex-row flex-wrap space-y-4 md:space-y-0 py-4 bg-white dark:bg-gray-900">
                <div className="flex items-end justify-between space-x-3">
                    <button
                        id="dropdownActionButton"
                        data-dropdown-toggle="dropdownAction"
                        className="inline-flex items-center text-gray-500 bg-white border border-gray-300 focus:outline-none hover:bg-gray-100 focus:ring-4 focus:ring-gray-100 font-medium rounded-lg text-sm px-3 py-1.5 dark:bg-gray-800 dark:text-gray-400 dark:border-gray-600 dark:hover:bg-gray-700 dark:hover:border-gray-600 dark:focus:ring-gray-700"
                        type="button"
                    >
                        <span className="sr-only">Action button</span>
                        Action
                        <svg
                            className="w-2.5 h-2.5 ms-2.5"
                            aria-hidden="true"
                            xmlns="http://www.w3.org/2000/svg"
                            fill="none"
                            viewBox="0 0 10 6"
                        >
                            <path
                                stroke="currentColor"
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth={2}
                                d="m1 1 4 4 4-4"
                            />
                        </svg>
                    </button>
                    <div
                        id="dropdownAction"
                        className="z-10 hidden bg-white divide-y divide-gray-100 rounded-lg shadow-sm w-44 dark:bg-gray-700 dark:divide-gray-600"
                    >
                        <ul
                            className="py-1 text-sm text-gray-700 dark:text-gray-200"
                            aria-labelledby="dropdownActionButton"
                        >
                            <li>
                                <a
                                    href="#"
                                    className="block px-4 py-2 hover:bg-gray-100 dark:hover:bg-gray-600 dark:hover:text-white"
                                >
                                    Reward
                                </a>
                            </li>
                            <li>
                                <a
                                    href="#"
                                    className="block px-4 py-2 hover:bg-gray-100 dark:hover:bg-gray-600 dark:hover:text-white"
                                >
                                    Promote
                                </a>
                            </li>
                            <li>
                                <a
                                    href="#"
                                    className="block px-4 py-2 hover:bg-gray-100 dark:hover:bg-gray-600 dark:hover:text-white"
                                >
                                    Activate account
                                </a>
                            </li>
                        </ul>
                        <div className="py-1">
                            <a
                                href="#"
                                className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 dark:hover:bg-gray-600 dark:text-gray-200 dark:hover:text-white"
                            >
                                Delete User
                            </a>
                        </div>
                    </div>



                    {/* Dropdown menu */}

                </div>

                <div className="relative">
                    <div className="absolute inset-y-0 rtl:inset-r-0 start-0 flex items-center ps-3 pointer-events-none">
                        <svg
                            className="w-4 h-4 text-gray-500 dark:text-gray-400"
                            aria-hidden="true"
                            xmlns="http://www.w3.org/2000/svg"
                            fill="none"
                            viewBox="0 0 20 20"
                        >
                            <path
                                stroke="currentColor"
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth={2}
                                d="m19 19-4-4m0-7A7 7 0 1 1 1 8a7 7 0 0 1 14 0Z"
                            />
                        </svg>
                    </div>
                    <input
                        disabled
                        type="text"
                        id="table-search-users"
                        className="block py-2 ps-10 text-sm text-gray-900 border border-gray-300 rounded-lg w-80 bg-gray-50 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                        placeholder="Search"
                    />
                </div>
            </div>
            <table className="w-full text-sm text-left rtl:text-right text-gray-500 dark:text-gray-400">
                <thead className=" text-gray-600  bg-gray-50 dark:bg-gray-700 dark:text-gray-400">
                    <tr>
                        <th scope="col" className="p-4">
                            <div className="flex items-center">
                                <input
                                    id="checkbox-all-search"
                                    type="checkbox"
                                    className="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 rounded-sm focus:ring-blue-500 dark:focus:ring-blue-600 dark:ring-offset-gray-800 dark:focus:ring-offset-gray-800 focus:ring-2 dark:bg-gray-700 dark:border-gray-600"
                                />
                                <label htmlFor="checkbox-all-search" className="sr-only">
                                    checkbox
                                </label>
                            </div>
                        </th>
                        <th scope="col" className="px-6 py-3 text-sm">
                            Nome
                        </th>
                        <th scope="col" className="px-6 py-3 text-sm">
                            Descrizione
                        </th>
                        <th scope="col" className="px-6 py-3 text-sm">
                            Status
                        </th>
                        <th scope="col" className="px-6 py-3 text-sm">
                            tipo operazione
                        </th>
                        <th scope="col" className="px-6 py-3 text-sm">

                        </th>
                    </tr>
                </thead>
                <tbody>

                    {isLoading ? (

                        <tr>
                            caricamento...

                            <svg aria-hidden="true" className="inline w-4 h-4 text-gray-200 animate-spin dark:text-gray-600 fill-blue-600" viewBox="0 0 100 101" fill="none" xmlns="http://www.w3.org/2000/svg">
                                <path d="M100 50.5908C100 78.2051 77.6142 100.591 50 100.591C22.3858 100.591 0 78.2051 0 50.5908C0 22.9766 22.3858 0.59082 50 0.59082C77.6142 0.59082 100 22.9766 100 50.5908ZM9.08144 50.5908C9.08144 73.1895 27.4013 91.5094 50 91.5094C72.5987 91.5094 90.9186 73.1895 90.9186 50.5908C90.9186 27.9921 72.5987 9.67226 50 9.67226C27.4013 9.67226 9.08144 27.9921 9.08144 50.5908Z" fill="currentColor" />
                                <path d="M93.9676 39.0409C96.393 38.4038 97.8624 35.9116 97.0079 33.5539C95.2932 28.8227 92.871 24.3692 89.8167 20.348C85.8452 15.1192 80.8826 10.7238 75.2124 7.41289C69.5422 4.10194 63.2754 1.94025 56.7698 1.05124C51.7666 0.367541 46.6976 0.446843 41.7345 1.27873C39.2613 1.69328 37.813 4.19778 38.4501 6.62326C39.0873 9.04874 41.5694 10.4717 44.0505 10.1071C47.8511 9.54855 51.7191 9.52689 55.5402 10.0491C60.8642 10.7766 65.9928 12.5457 70.6331 15.2552C75.2735 17.9648 79.3347 21.5619 82.5849 25.841C84.9175 28.9121 86.7997 32.2913 88.1811 35.8758C89.083 38.2158 91.5421 39.6781 93.9676 39.0409Z" fill="currentFill" />
                            </svg>

                        </tr>


                    ) : listOfAnalyzes.length > 0 ? (
                        listOfAnalyzes.map((Analyze, index) => (
                            <TableRowComp key={index} managerRowInfoVideo={managerRowInfoVideo} onToggleSwitchToAnalisiVideo={changeToAnalisiComponent} infoAnalyze={Analyze} isOpenDropDown={openDropdown === Analyze.id} onToggleDropdown={handleDropdownToggle} />
                        ))
                    ) : (
                        <tr>nessun elemento</tr>  // Puoi anche aggiungere un messaggio di fallback
                    )

                    }


                </tbody>
            </table>
        </div>

    );
}