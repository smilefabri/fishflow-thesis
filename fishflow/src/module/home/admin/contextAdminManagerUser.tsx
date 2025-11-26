import { useEffect, useState } from "react";
import Modal from 'react-modal';
import { generateClient } from 'aws-amplify/data';
import { Schema } from '../../../../amplify/data/resource'
import { Nullable } from "@aws-amplify/data-schema";



Modal.setAppElement('#root');

const client = generateClient<Schema>();


function UtentiTable() {

    const [isOpen, setIsOpen] = useState(false);
    const [dataAziendaTable, setDataAziendaTable] = useState<Array<Schema['Azienda']['type']>>([]);
    const [dataCollabTable, setDataCollabTable] = useState<Array<Schema['Collaboratori']['type']>>([]);
    const [email, setEmail] = useState('');
    const [infoAzienda, setinfoAzienda] = useState({ nome: '', id: '' });
    const [ruolo, setRuolo] = useState('');
    const validRuoli: ('ADMIN' | 'ADMIN_AZIENDA' | 'USERS')[] = ['ADMIN', 'ADMIN_AZIENDA', 'USERS'];



    useEffect(() => {

        
        const subscriptionCollab = client.models.Collaboratori.observeQuery().subscribe({
            next: (data) => {
                console.log("Dati aggiornati dal server:", data);
                setDataCollabTable([...data.items]); // Aggiorna la tabella automaticamente
            },
            error: (err) => console.error("Errore nella subscription:", err),
        });

        const subscriptionAzienda = client.models.Azienda.observeQuery().subscribe({
            next: (data) => {
                console.log("Dati aggiornati dal server:", data);
                setDataAziendaTable([...data.items]); // Aggiorna la tabella automaticamente
            },
            error: (err) => console.error("Errore nella subscription:", err),
        });

        return () => {
            subscriptionCollab.unsubscribe();
            subscriptionAzienda.unsubscribe();
        }; // Cleanup della subscription
    }, []);

    function TrovaNomeAzienda(id: Nullable<string> | undefined) {
        const Azienda = dataAziendaTable.find(item => item.id === id);
        return Azienda?.name;
    }

    async function PostNewUserEvent(e: React.FormEvent) {
        e.preventDefault();

        if (!email || !ruolo || !infoAzienda?.id || !infoAzienda?.nome) {
            console.log("email: ", email);
            console.log("ruolo: ", ruolo);
            console.log("azienda: ", infoAzienda.nome);
            console.error("Tutti i campi sono obbligatori.");
            return;
        }

        console.log("email: ", email);
        console.log("ruolo: ", ruolo);
        console.log("azienda: ", infoAzienda.id);

        try {
            if (validRuoli.includes(ruolo as 'ADMIN' | 'ADMIN_AZIENDA' | 'USERS')) {
                const { data, errors } = await client.mutations.createUser({
                    email: email,
                    ruolo: ruolo as 'ADMIN' | 'ADMIN_AZIENDA' | 'USERS',
                    aziendaId: infoAzienda.id,
                });
                console.log(data);
                console.log(errors);
            } else {
                console.error(`Ruolo '${ruolo}' non valido.`);
            }
        } catch (error) {
            console.log('call failed: ', error);
        }
    }


    //const [dataUserTable, setDataUserTable] = useState([]);


    return (
        <section className="bg-gray-50 dark:bg-gray-900 pt-3 pr-3 ">
            <div className="mx-auto max-w-screen-xl ">
                {/* Start coding here */}
                <div className="bg-white dark:bg-gray-800 relative  sm:rounded-lg overflow-hidden">
                    <div className="flex flex-col md:flex-row items-center justify-between space-y-3 md:space-y-0 md:space-x-4 p-4">
                        <div className="w-full md:w-1/2">
                            <form className="flex items-center">
                                <label htmlFor="simple-search" className="sr-only">
                                    Search
                                </label>
                                <div className="relative w-full">
                                    <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                                        <svg
                                            aria-hidden="true"
                                            className="w-5 h-5 text-gray-500 dark:text-gray-400"
                                            fill="currentColor"
                                            viewBox="0 0 20 20"
                                            xmlns="http://www.w3.org/2000/svg"
                                        >
                                            <path
                                                fillRule="evenodd"
                                                d="M8 4a4 4 0 100 8 4 4 0 000-8zM2 8a6 6 0 1110.89 3.476l4.817 4.817a1 1 0 01-1.414 1.414l-4.816-4.816A6 6 0 012 8z"
                                                clipRule="evenodd"
                                            />
                                        </svg>
                                    </div>
                                    <input
                                        type="text"
                                        id="simple-search"
                                        className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-primary-500 focus:border-primary-500 block w-full pl-10 p-2 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-primary-500 dark:focus:border-primary-500"
                                        placeholder="Search"

                                    />
                                </div>
                            </form>
                        </div>
                        <div className="w-full md:w-auto flex flex-col md:flex-row space-y-2 md:space-y-0 items-stretch md:items-center justify-end md:space-x-3 flex-shrink-0">
                            <button
                                onClick={() => setIsOpen(true)}
                                type="button"
                                className="flex items-center justify-center text-white bg-primary-700 hover:bg-primary-800 focus:ring-4 focus:ring-primary-300 font-medium rounded-lg text-sm px-4 py-2 dark:bg-primary-600 dark:hover:bg-primary-700 focus:outline-none dark:focus:ring-primary-800"
                            >
                                <svg
                                    className="h-3.5 w-3.5 mr-2"
                                    fill="currentColor"
                                    viewBox="0 0 20 20"
                                    xmlns="http://www.w3.org/2000/svg"
                                    aria-hidden="true"
                                >
                                    <path
                                        clipRule="evenodd"
                                        fillRule="evenodd"
                                        d="M10 3a1 1 0 011 1v5h5a1 1 0 110 2h-5v5a1 1 0 11-2 0v-5H4a1 1 0 110-2h5V4a1 1 0 011-1z"
                                    />
                                </svg>
                                Add User
                            </button>
                            <Modal
                                isOpen={isOpen}
                                onRequestClose={() => setIsOpen(false)}
                                className="bg-white z-[99999] p-6 rounded shadow-lg w-1/3 mx-auto "

                                overlayClassName="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-[9999]"


                            >

                                {/* Main modal */}
                                <div
                                    id="authentication-modal"

                                    className="justify-center items-center  z-[9999] w-full inset-0 h-[calc(100%-1rem)] max-h-full"
                                >
                                    <div className="relative p-4 w-full max-w-md max-h-full">
                                        {/* Modal content */}
                                        <div className="relative bg-white rounded-lg shadow-sm dark:bg-gray-700">
                                            {/* Modal header */}
                                            <div className="flex items-center justify-between p-4 md:p-5 border-b rounded-t dark:border-gray-600 border-gray-200">
                                                <h3 className="text-xl font-semibold text-gray-900 dark:text-white">
                                                    Invia invito all'utente
                                                </h3>
                                                <button
                                                    type="button"
                                                    onClick={() => setIsOpen(false)}
                                                    className="end-2.5 text-gray-400 bg-transparent hover:bg-gray-200 hover:text-gray-900 rounded-lg text-sm w-8 h-8 ms-auto inline-flex justify-center items-center dark:hover:bg-gray-600 dark:hover:text-white"
                                                    data-modal-hide="authentication-modal"
                                                >
                                                    <svg
                                                        className="w-3 h-3"
                                                        aria-hidden="true"
                                                        xmlns="http://www.w3.org/2000/svg"
                                                        fill="none"
                                                        viewBox="0 0 14 14"
                                                    >
                                                        <path
                                                            stroke="currentColor"
                                                            strokeLinecap="round"
                                                            strokeLinejoin="round"
                                                            strokeWidth={2}
                                                            d="m1 1 6 6m0 0 6 6M7 7l6-6M7 7l-6 6"
                                                        />
                                                    </svg>
                                                    <span className="sr-only">Close modal</span>
                                                </button>
                                            </div>
                                            {/* Modal body */}
                                            <div className="p-4 md:p-5">
                                                <form className="space-y-4" onSubmit={PostNewUserEvent} action="#">

                                                    <div className="mb-5">
                                                        <label
                                                            htmlFor="email"
                                                            className="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
                                                        >
                                                            Your email :
                                                        </label>
                                                        <input
                                                            type="email"
                                                            id="email"
                                                            onChange={(e) => setEmail(e.target.value)}
                                                            className="shadow-xs bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500 dark:shadow-xs-light"
                                                            placeholder="name@email.com"
                                                            required
                                                        />

                                                    </div>

                                                    <div className="mb-5">
                                                        <label

                                                            className="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
                                                        >
                                                            Selezione l'azienda :
                                                        </label>

                                                        <select

                                                            onChange={(e) => {
                                                                console.log("test debug:", e);
                                                                const selectedOption = dataAziendaTable.find(
                                                                    (azienda) => azienda.name === e.target.value
                                                                );
                                                                if (selectedOption) {
                                                                    setinfoAzienda({ nome: selectedOption.name, id: selectedOption.id });
                                                                }
                                                            }} className="bg-gray-50 border border-gray-300  text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"

                                                            required
                                                        >

                                                            <option disabled selected value="#">seleziona azienda</option>
                                                            {dataAziendaTable.length > 0 ? (
                                                                dataAziendaTable.map((azienda) => (


                                                                    <option key={azienda.id} value={azienda.name} >{azienda.name}</option>


                                                                ))
                                                            ) : (
                                                                <option value="#">azienda</option>
                                                            )}


                                                        </select>
                                                    </div>

                                                    <div className="mb-5">
                                                        <label

                                                            className="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
                                                        >
                                                            Selezione ruolo :
                                                        </label>
                                                        <select
                                                            required
                                                            onChange={(e) => setRuolo(e.target.value.toUpperCase())}
                                                            className="bg-gray-50 border border-gray-300  text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                                                        >

                                                            {validRuoli.map((role, index) => (
                                                                <option key={index} >{role.toLocaleLowerCase()}</option>
                                                            ))}



                                                        </select>
                                                    </div>

                                                    <button
                                                        type="submit"

                                                        className="text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800"
                                                    >
                                                        Register new account
                                                    </button>



                                                </form>
                                            </div>
                                        </div>
                                    </div>
                                </div>


                            </Modal>




                            <div className="flex items-center space-x-3 w-full md:w-auto">
                                <button

                                    id="actionsDropdownButton"
                                    data-dropdown-toggle="actionsDropdown"
                                    className="w-full md:w-auto flex items-center justify-center py-2 px-4 text-sm font-medium text-gray-900 focus:outline-none bg-white rounded-lg border border-gray-200 hover:bg-gray-100 hover:text-primary-700  focus:ring-4 focus:ring-gray-200 dark:focus:ring-gray-700 dark:bg-gray-800 dark:text-gray-400 dark:border-gray-600 dark:hover:text-white dark:hover:bg-gray-700"
                                    type="button"
                                >
                                    <svg
                                        className="-ml-1 mr-1.5 w-5 h-5"
                                        fill="currentColor"
                                        viewBox="0 0 20 20"
                                        xmlns="http://www.w3.org/2000/svg"
                                        aria-hidden="true"
                                    >
                                        <path
                                            clipRule="evenodd"
                                            fillRule="evenodd"
                                            d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z"
                                        />
                                    </svg>
                                    Actions
                                </button>




                            </div>
                        </div>
                    </div>
                    <div className="overflow-x-auto">
                        <table className="w-full text-sm text-left text-gray-500 dark:text-gray-400">
                            <thead className="text-xs text-gray-700 uppercase bg-gray-50 dark:bg-gray-700 dark:text-gray-400">
                                <tr>

                                    <th scope="col" className="px-4 py-3">
                                        email
                                    </th>
                                    <th scope="col" className="px-4 py-3">
                                        Azienda
                                    </th>
                                    <th scope="col" className="px-4 py-3">
                                        ruolo
                                    </th>

                                    <th scope="col" className="px-4 py-3">
                                        status
                                    </th>


                                    <th scope="col" className="px-4 py-3">
                                        <span className="sr-only">Actions</span>
                                    </th>
                                </tr>
                            </thead>
                            <tbody>
                                {dataAziendaTable.length > 0 ? (

                                    dataCollabTable.map((Collab) => (


                                        <tr key={Collab.id} className="border-b dark:border-gray-700 hover:bg-slate-100">

                                            <td className="px-4 py-3">{Collab.utenteId}</td>
                                            <td className="px-4 py-3">{TrovaNomeAzienda?.(Collab.aziendaId) || "N/A"}</td>
                                            <td className="px-4 py-3">{Collab.ruolo?.toLowerCase()}</td>
                                            <td className="px-4 py-3">status</td>

                                            <td className="px-4 py-3 flex items-center justify-end">
                                                <button
                                                    id="apple-imac-27-dropdown-button"
                                                    data-dropdown-toggle="apple-imac-27-dropdown"
                                                    className="inline-flex items-center p-0.5 text-sm font-medium text-center text-gray-500 hover:text-gray-800 rounded-lg focus:outline-none dark:text-gray-400 dark:hover:text-gray-100"
                                                    type="button"
                                                >
                                                    <svg
                                                        className="w-5 h-5"
                                                        aria-hidden="true"
                                                        fill="currentColor"
                                                        viewBox="0 0 20 20"
                                                        xmlns="http://www.w3.org/2000/svg"
                                                    >
                                                        <path d="M6 10a2 2 0 11-4 0 2 2 0 014 0zM12 10a2 2 0 11-4 0 2 2 0 014 0zM16 12a2 2 0 100-4 2 2 0 000 4z" />
                                                    </svg>
                                                </button>
                                                <div
                                                    id="apple-imac-27-dropdown"
                                                    className="hidden z-10 w-44 bg-white rounded divide-y divide-gray-100 shadow dark:bg-gray-700 dark:divide-gray-600"
                                                >
                                                    <ul
                                                        className="py-1 text-sm text-gray-700 dark:text-gray-200"
                                                        aria-labelledby="apple-imac-27-dropdown-button"
                                                    >
                                                        <li>
                                                            <a
                                                                href="#"
                                                                className="block py-2 px-4 hover:bg-gray-100 dark:hover:bg-gray-600 dark:hover:text-white"
                                                            >
                                                                Show
                                                            </a>
                                                        </li>
                                                        <li>
                                                            <a
                                                                href="#"
                                                                className="block py-2 px-4 hover:bg-gray-100 dark:hover:bg-gray-600 dark:hover:text-white"
                                                            >
                                                                Edit
                                                            </a>
                                                        </li>
                                                    </ul>
                                                    <div className="py-1">
                                                        <a
                                                            href="#"
                                                            className="block py-2 px-4 text-sm text-gray-700 hover:bg-gray-100 dark:hover:bg-gray-600 dark:text-gray-200 dark:hover:text-white"
                                                        >
                                                            Delete
                                                        </a>
                                                    </div>
                                                </div>
                                            </td>
                                        </tr>
                                    ))
                                ) : (
                                    <tr>
                                        <td colSpan={2} style={{ textAlign: 'center' }}>Nessuna azienda disponibile</td>
                                    </tr>
                                )}

                            </tbody>
                        </table>
                    </div>
                    <nav
                        className="flex flex-col md:flex-row justify-between items-start md:items-center space-y-3 md:space-y-0 p-4"
                        aria-label="Table navigation"
                    >
                        <span className="text-sm font-normal text-gray-500 dark:text-gray-400">
                            Showing
                            <span className="font-semibold text-gray-900 dark:text-white">
                                1-10
                            </span>
                            of
                            <span className="font-semibold text-gray-900 dark:text-white">
                                1000
                            </span>
                        </span>
                        <ul className="inline-flex items-stretch -space-x-px">
                            <li>
                                <a
                                    href="#"
                                    className="flex items-center justify-center h-full py-1.5 px-3 ml-0 text-gray-500 bg-white rounded-l-lg border border-gray-300 hover:bg-gray-100 hover:text-gray-700 dark:bg-gray-800 dark:border-gray-700 dark:text-gray-400 dark:hover:bg-gray-700 dark:hover:text-white"
                                >
                                    <span className="sr-only">Previous</span>
                                    <svg
                                        className="w-5 h-5"
                                        aria-hidden="true"
                                        fill="currentColor"
                                        viewBox="0 0 20 20"
                                        xmlns="http://www.w3.org/2000/svg"
                                    >
                                        <path
                                            fillRule="evenodd"
                                            d="M12.707 5.293a1 1 0 010 1.414L9.414 10l3.293 3.293a1 1 0 01-1.414 1.414l-4-4a1 1 0 010-1.414l4-4a1 1 0 011.414 0z"
                                            clipRule="evenodd"
                                        />
                                    </svg>
                                </a>
                            </li>
                            <li>
                                <a
                                    href="#"
                                    className="flex items-center justify-center text-sm py-2 px-3 leading-tight text-gray-500 bg-white border border-gray-300 hover:bg-gray-100 hover:text-gray-700 dark:bg-gray-800 dark:border-gray-700 dark:text-gray-400 dark:hover:bg-gray-700 dark:hover:text-white"
                                >
                                    1
                                </a>
                            </li>
                            <li>
                                <a
                                    href="#"
                                    className="flex items-center justify-center text-sm py-2 px-3 leading-tight text-gray-500 bg-white border border-gray-300 hover:bg-gray-100 hover:text-gray-700 dark:bg-gray-800 dark:border-gray-700 dark:text-gray-400 dark:hover:bg-gray-700 dark:hover:text-white"
                                >
                                    2
                                </a>
                            </li>
                            <li>
                                <a
                                    href="#"
                                    aria-current="page"
                                    className="flex items-center justify-center text-sm z-10 py-2 px-3 leading-tight text-primary-600 bg-primary-50 border border-primary-300 hover:bg-primary-100 hover:text-primary-700 dark:border-gray-700 dark:bg-gray-700 dark:text-white"
                                >
                                    3
                                </a>
                            </li>
                            <li>
                                <a
                                    href="#"
                                    className="flex items-center justify-center text-sm py-2 px-3 leading-tight text-gray-500 bg-white border border-gray-300 hover:bg-gray-100 hover:text-gray-700 dark:bg-gray-800 dark:border-gray-700 dark:text-gray-400 dark:hover:bg-gray-700 dark:hover:text-white"
                                >
                                    ...
                                </a>
                            </li>
                            <li>
                                <a
                                    href="#"
                                    className="flex items-center justify-center text-sm py-2 px-3 leading-tight text-gray-500 bg-white border border-gray-300 hover:bg-gray-100 hover:text-gray-700 dark:bg-gray-800 dark:border-gray-700 dark:text-gray-400 dark:hover:bg-gray-700 dark:hover:text-white"
                                >
                                    100
                                </a>
                            </li>
                            <li>
                                <a
                                    href="#"
                                    className="flex items-center justify-center h-full py-1.5 px-3 leading-tight text-gray-500 bg-white rounded-r-lg border border-gray-300 hover:bg-gray-100 hover:text-gray-700 dark:bg-gray-800 dark:border-gray-700 dark:text-gray-400 dark:hover:bg-gray-700 dark:hover:text-white"
                                >
                                    <span className="sr-only">Next</span>
                                    <svg
                                        className="w-5 h-5"
                                        aria-hidden="true"
                                        fill="currentColor"
                                        viewBox="0 0 20 20"
                                        xmlns="http://www.w3.org/2000/svg"
                                    >
                                        <path
                                            fillRule="evenodd"
                                            d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z"
                                            clipRule="evenodd"
                                        />
                                    </svg>
                                </a>
                            </li>
                        </ul>
                    </nav>
                </div>
            </div>
        </section>
    );

}


function AziendaTable() {

    const [dataAziendaTable, setDataAziendaTable] = useState<Array<Schema['Azienda']['type']>>([]);
    const [isOpen, setIsOpen] = useState(false);
    const [infoAzienda, setinfoAzienda] = useState('')

    // Effetto per ascoltare gli aggiornamenti in tempo reale
    useEffect(() => {
        const subscription = client.models.Azienda.observeQuery().subscribe({
            next: (data) => {
                console.log("Dati aggiornati dal server:", data);
                setDataAziendaTable([...data.items]); // Aggiorna la tabella automaticamente
            },
            error: (err) => console.error("Errore nella subscription:", err),
        });

        return () => subscription.unsubscribe(); // Cleanup della subscription
    }, []);


    async function addAziendaToTable() {

        try {

            // Assicurati che infoAzienda sia definito
            const { errors, data } = await client.models.Azienda.create({

                name: infoAzienda,  // Devi passare il valore corretto per infoAzienda

            });

            // Verifica se ci sono errori
            if (errors) {
                console.log('error:', errors);
            } else {
                console.log('dati:', data);
                setIsOpen(false);
                /* await UpdateTableAzienda(); */
            }
        } catch (error) {
            // Gestisci eventuali errori imprevisti
            console.error('Errore durante l\'operazione:', error);
        }
    }
    // Monitoraggio dei dati aggiornati
    useEffect(() => {
        console.log('Dati aggiornati:', dataAziendaTable);
    }, [dataAziendaTable]);

    return (
        <section className="bg-gray-50 dark:bg-gray-900 pt-3 pr-3 ">
            <div className="mx-auto max-w-screen-xl ">
                {/* Start coding here */}
                <div className="bg-white dark:bg-gray-800 relative  sm:rounded-lg overflow-hidden">
                    <div className="flex flex-col md:flex-row items-center justify-between space-y-3 md:space-y-0 md:space-x-4 p-4">
                        <div className="w-full md:w-1/2">
                            <form className="flex items-center">
                                <label htmlFor="simple-search" className="sr-only">
                                    Search
                                </label>
                                <div className="relative w-full">
                                    <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                                        <svg
                                            aria-hidden="true"
                                            className="w-5 h-5 text-gray-500 dark:text-gray-400"
                                            fill="currentColor"
                                            viewBox="0 0 20 20"
                                            xmlns="http://www.w3.org/2000/svg"
                                        >
                                            <path
                                                fillRule="evenodd"
                                                d="M8 4a4 4 0 100 8 4 4 0 000-8zM2 8a6 6 0 1110.89 3.476l4.817 4.817a1 1 0 01-1.414 1.414l-4.816-4.816A6 6 0 012 8z"
                                                clipRule="evenodd"
                                            />
                                        </svg>
                                    </div>
                                    <input
                                        type="text"
                                        id="simple-search"
                                        className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-primary-500 focus:border-primary-500 block w-full pl-10 p-2 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-primary-500 dark:focus:border-primary-500"
                                        placeholder="Search"

                                    />
                                </div>
                            </form>
                        </div>
                        <div className="w-full md:w-auto flex flex-col md:flex-row space-y-2 md:space-y-0 items-stretch md:items-center justify-end md:space-x-3 flex-shrink-0">
                            <button
                                type="button"
                                onClick={() => setIsOpen(true)}
                                className="flex items-center justify-center text-white bg-primary-700 hover:bg-primary-800 focus:ring-4 focus:ring-primary-300 font-medium rounded-lg text-sm px-4 py-2 dark:bg-primary-600 dark:hover:bg-primary-700 focus:outline-none dark:focus:ring-primary-800"
                            >
                                <svg
                                    className="h-3.5 w-3.5 mr-2"
                                    fill="currentColor"
                                    viewBox="0 0 20 20"
                                    xmlns="http://www.w3.org/2000/svg"
                                    aria-hidden="true"
                                >
                                    <path
                                        clipRule="evenodd"
                                        fillRule="evenodd"
                                        d="M10 3a1 1 0 011 1v5h5a1 1 0 110 2h-5v5a1 1 0 11-2 0v-5H4a1 1 0 110-2h5V4a1 1 0 011-1z"
                                    />
                                </svg>
                                Add azienda
                            </button>


                            <Modal
                                isOpen={isOpen}
                                onRequestClose={() => setIsOpen(false)}
                                className="bg-white z-[99999] p-6 rounded shadow-lg w-1/3 mx-auto "
                                overlayClassName="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-[9999]"
                            >
                                {/* Main modal */}
                                <div
                                    id="authentication-modal"

                                    className="justify-center items-center  z-[9999] w-full inset-0 h-[calc(100%-1rem)] max-h-full"
                                >
                                    <div className="relative p-4 w-full max-w-md max-h-full">
                                        {/* Modal content */}
                                        <div className="relative bg-white rounded-lg shadow-sm dark:bg-gray-700">
                                            {/* Modal header */}
                                            <div className="flex items-center justify-between p-4 md:p-5 border-b rounded-t dark:border-gray-600 border-gray-200">
                                                <h3 className="text-xl font-semibold text-gray-900 dark:text-white">
                                                    Aggiungi un azienda
                                                </h3>
                                                <button
                                                    type="button"
                                                    onClick={() => setIsOpen(false)}
                                                    className="end-2.5 text-gray-400 bg-transparent hover:bg-gray-200 hover:text-gray-900 rounded-lg text-sm w-8 h-8 ms-auto inline-flex justify-center items-center dark:hover:bg-gray-600 dark:hover:text-white"
                                                    data-modal-hide="authentication-modal"
                                                >
                                                    <svg
                                                        className="w-3 h-3"
                                                        aria-hidden="true"
                                                        xmlns="http://www.w3.org/2000/svg"
                                                        fill="none"
                                                        viewBox="0 0 14 14"
                                                    >
                                                        <path
                                                            stroke="currentColor"
                                                            strokeLinecap="round"
                                                            strokeLinejoin="round"
                                                            strokeWidth={2}
                                                            d="m1 1 6 6m0 0 6 6M7 7l6-6M7 7l-6 6"
                                                        />
                                                    </svg>
                                                    <span className="sr-only">Close modal</span>
                                                </button>
                                            </div>
                                            {/* Modal body */}
                                            <div className="p-4 md:p-5">
                                                <form className="space-y-4" action="#">
                                                    <div>
                                                        <label
                                                            htmlFor="email"
                                                            className="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
                                                        >
                                                            Nome dell'azienda :

                                                        </label>
                                                        <input
                                                            onChange={(e) => {
                                                                //console.log("nome");
                                                                setinfoAzienda(e.target.value)
                                                            }}
                                                            type="text"

                                                            id="email"
                                                            className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-600 dark:border-gray-500 dark:placeholder-gray-400 dark:text-white"
                                                            placeholder="nome azienda"
                                                        />
                                                    </div>

                                                    <button
                                                        onClick={() => addAziendaToTable()}
                                                        type="submit"
                                                        className="w-full text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800"
                                                    >
                                                        Invia invito
                                                    </button>

                                                </form>
                                            </div>
                                        </div>
                                    </div>
                                </div>


                            </Modal>

                            <div className="flex items-center space-x-3 w-full md:w-auto">
                                <button
                                    id="actionsDropdownButton"
                                    data-dropdown-toggle="actionsDropdown"
                                    className="w-full md:w-auto flex items-center justify-center py-2 px-4 text-sm font-medium text-gray-900 focus:outline-none bg-white rounded-lg border border-gray-200 hover:bg-gray-100 hover:text-primary-700 focus:z-10 focus:ring-4 focus:ring-gray-200 dark:focus:ring-gray-700 dark:bg-gray-800 dark:text-gray-400 dark:border-gray-600 dark:hover:text-white dark:hover:bg-gray-700"
                                    type="button"
                                >
                                    <svg
                                        className="-ml-1 mr-1.5 w-5 h-5"
                                        fill="currentColor"
                                        viewBox="0 0 20 20"
                                        xmlns="http://www.w3.org/2000/svg"
                                        aria-hidden="true"
                                    >
                                        <path
                                            clipRule="evenodd"
                                            fillRule="evenodd"
                                            d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z"
                                        />
                                    </svg>
                                    Actions
                                </button>

                            </div>
                        </div>
                    </div>
                    <div className="overflow-x-auto">
                        <table className="w-full text-sm text-left text-gray-500 dark:text-gray-400">
                            <thead className="text-xs text-gray-700 uppercase bg-gray-50 dark:bg-gray-700 dark:text-gray-400">
                                <tr>
                                    <th scope="col" className="px-4 py-3">
                                        Nome
                                    </th>

                                    <th scope="col" className="px-4 py-3">
                                        <span className="sr-only">Actions</span>
                                    </th>
                                </tr>
                            </thead>
                            <tbody>

                                {dataAziendaTable.length > 0 ? (

                                    dataAziendaTable.map((azienda) => (


                                        <tr key={azienda.id} className="border-b dark:border-gray-700 hover:bg-slate-100">
                                            <th

                                                scope="row"
                                                className="px-4 py-3 font-medium text-gray-900 whitespace-nowrap dark:text-white "
                                            >
                                                {azienda.name}
                                            </th>


                                            <td className="px-4 py-3 flex items-center justify-end">
                                                <button
                                                    id="apple-imac-27-dropdown-button"
                                                    data-dropdown-toggle="apple-imac-27-dropdown"
                                                    className="inline-flex items-center p-0.5 text-sm font-medium text-center text-gray-500 hover:text-gray-800 rounded-lg focus:outline-none dark:text-gray-400 dark:hover:text-gray-100"
                                                    type="button"
                                                >
                                                    <svg
                                                        className="w-5 h-5"
                                                        aria-hidden="true"
                                                        fill="currentColor"
                                                        viewBox="0 0 20 20"
                                                        xmlns="http://www.w3.org/2000/svg"
                                                    >
                                                        <path d="M6 10a2 2 0 11-4 0 2 2 0 014 0zM12 10a2 2 0 11-4 0 2 2 0 014 0zM16 12a2 2 0 100-4 2 2 0 000 4z" />
                                                    </svg>
                                                </button>
                                                <div
                                                    id="apple-imac-27-dropdown"
                                                    className="hidden z-10 w-44 bg-white rounded divide-y divide-gray-100 shadow dark:bg-gray-700 dark:divide-gray-600"
                                                >
                                                    <ul
                                                        className="py-1 text-sm text-gray-700 dark:text-gray-200"
                                                        aria-labelledby="apple-imac-27-dropdown-button"
                                                    >
                                                        <li>
                                                            <a
                                                                href="#"
                                                                className="block py-2 px-4 hover:bg-gray-100 dark:hover:bg-gray-600 dark:hover:text-white"
                                                            >
                                                                Show
                                                            </a>
                                                        </li>
                                                        <li>
                                                            <a
                                                                href="#"
                                                                className="block py-2 px-4 hover:bg-gray-100 dark:hover:bg-gray-600 dark:hover:text-white"
                                                            >
                                                                Edit
                                                            </a>
                                                        </li>
                                                    </ul>
                                                    <div className="py-1">
                                                        <a
                                                            href="#"
                                                            className="block py-2 px-4 text-sm text-gray-700 hover:bg-gray-100 dark:hover:bg-gray-600 dark:text-gray-200 dark:hover:text-white"
                                                        >
                                                            Delete
                                                        </a>
                                                    </div>
                                                </div>
                                            </td>
                                        </tr>




                                    ))
                                ) : (
                                    <tr>
                                        <td colSpan={2} style={{ textAlign: 'center' }}>Nessuna azienda disponibile</td>
                                    </tr>
                                )}


                            </tbody>
                        </table>
                    </div>
                    <nav
                        className="flex flex-col md:flex-row justify-between items-start md:items-center space-y-3 md:space-y-0 p-4"
                        aria-label="Table navigation"
                    >
                        <span className="text-sm font-normal text-gray-500 dark:text-gray-400">
                            Showing
                            <span className="font-semibold text-gray-900 dark:text-white">
                                1-10
                            </span>
                            of
                            <span className="font-semibold text-gray-900 dark:text-white">
                                1000
                            </span>
                        </span>
                        <ul className="inline-flex items-stretch -space-x-px">
                            <li>
                                <a
                                    href="#"
                                    className="flex items-center justify-center h-full py-1.5 px-3 ml-0 text-gray-500 bg-white rounded-l-lg border border-gray-300 hover:bg-gray-100 hover:text-gray-700 dark:bg-gray-800 dark:border-gray-700 dark:text-gray-400 dark:hover:bg-gray-700 dark:hover:text-white"
                                >
                                    <span className="sr-only">Previous</span>
                                    <svg
                                        className="w-5 h-5"
                                        aria-hidden="true"
                                        fill="currentColor"
                                        viewBox="0 0 20 20"
                                        xmlns="http://www.w3.org/2000/svg"
                                    >
                                        <path
                                            fillRule="evenodd"
                                            d="M12.707 5.293a1 1 0 010 1.414L9.414 10l3.293 3.293a1 1 0 01-1.414 1.414l-4-4a1 1 0 010-1.414l4-4a1 1 0 011.414 0z"
                                            clipRule="evenodd"
                                        />
                                    </svg>
                                </a>
                            </li>
                            <li>
                                <a
                                    href="#"
                                    className="flex items-center justify-center text-sm py-2 px-3 leading-tight text-gray-500 bg-white border border-gray-300 hover:bg-gray-100 hover:text-gray-700 dark:bg-gray-800 dark:border-gray-700 dark:text-gray-400 dark:hover:bg-gray-700 dark:hover:text-white"
                                >
                                    1
                                </a>
                            </li>
                            <li>
                                <a
                                    href="#"
                                    className="flex items-center justify-center text-sm py-2 px-3 leading-tight text-gray-500 bg-white border border-gray-300 hover:bg-gray-100 hover:text-gray-700 dark:bg-gray-800 dark:border-gray-700 dark:text-gray-400 dark:hover:bg-gray-700 dark:hover:text-white"
                                >
                                    2
                                </a>
                            </li>
                            <li>
                                <a
                                    href="#"
                                    aria-current="page"
                                    className="flex items-center justify-center text-sm z-10 py-2 px-3 leading-tight text-primary-600 bg-primary-50 border border-primary-300 hover:bg-primary-100 hover:text-primary-700 dark:border-gray-700 dark:bg-gray-700 dark:text-white"
                                >
                                    3
                                </a>
                            </li>
                            <li>
                                <a
                                    href="#"
                                    className="flex items-center justify-center text-sm py-2 px-3 leading-tight text-gray-500 bg-white border border-gray-300 hover:bg-gray-100 hover:text-gray-700 dark:bg-gray-800 dark:border-gray-700 dark:text-gray-400 dark:hover:bg-gray-700 dark:hover:text-white"
                                >
                                    ...
                                </a>
                            </li>
                            <li>
                                <a
                                    href="#"
                                    className="flex items-center justify-center text-sm py-2 px-3 leading-tight text-gray-500 bg-white border border-gray-300 hover:bg-gray-100 hover:text-gray-700 dark:bg-gray-800 dark:border-gray-700 dark:text-gray-400 dark:hover:bg-gray-700 dark:hover:text-white"
                                >
                                    100
                                </a>
                            </li>
                            <li>
                                <a
                                    href="#"
                                    className="flex items-center justify-center h-full py-1.5 px-3 leading-tight text-gray-500 bg-white rounded-r-lg border border-gray-300 hover:bg-gray-100 hover:text-gray-700 dark:bg-gray-800 dark:border-gray-700 dark:text-gray-400 dark:hover:bg-gray-700 dark:hover:text-white"
                                >
                                    <span className="sr-only">Next</span>
                                    <svg
                                        className="w-5 h-5"
                                        aria-hidden="true"
                                        fill="currentColor"
                                        viewBox="0 0 20 20"
                                        xmlns="http://www.w3.org/2000/svg"
                                    >
                                        <path
                                            fillRule="evenodd"
                                            d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z"
                                            clipRule="evenodd"
                                        />
                                    </svg>
                                </a>
                            </li>
                        </ul>
                    </nav>
                </div>
            </div>
        </section>
    );

}

function TabTableUser({ selectedTab, onSelectTable }: { selectedTab: string, onSelectTable: (tab: string) => void }) {






    return (
        <div className="border-b border-gray-200 dark:border-gray-700">
            <ul className="flex flex-wrap -mb-px text-sm font-medium text-center text-gray-500 dark:text-gray-400">
                <li onClick={() => onSelectTable('utentiTab')} className="me-2 cursor-pointer">
                    <a
                        href="#"
                        className={`inline-flex items-center justify-center p-4 border-b-2 rounded-t-lg group 
                            ${selectedTab === 'utentiTab' ? "text-blue-600 border-blue-600 dark:text-blue-500 dark:border-blue-500"
                                : "border-transparent hover:text-gray-600 hover:border-gray-300 dark:hover:text-gray-300"}`}
                    >
                        <svg className={`w-4 h-4 me-2 ${selectedTab === 'utentiTab' ? "text-blue-600 dark:text-blue-500" : "text-gray-400 group-hover:text-gray-500 dark:text-gray-500 dark:group-hover:text-gray-300"}`}
                            aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="currentColor" viewBox="0 0 20 20">
                            <path d="M10 0a10 10 0 1 0 10 10A10.011 10.011 0 0 0 10 0Zm0 5a3 3 0 1 1 0 6 3 3 0 0 1 0-6Zm0 13a8.949 8.949 0 0 1-4.951-1.488A3.987 3.987 0 0 1 9 13h2a3.987 3.987 0 0 1 3.951 3.512A8.949 8.949 0 0 1 10 18Z" />
                        </svg>
                        Utenti
                    </a>
                </li>
                <li onClick={() => onSelectTable('AziendaTab')} className="me-2 cursor-pointer">
                    <a
                        href="#"
                        className={`inline-flex items-center justify-center p-4 border-b-2 rounded-t-lg group 
                            ${selectedTab === 'AziendaTab' ? "text-blue-600 border-blue-600 dark:text-blue-500 dark:border-blue-500"
                                : "border-transparent hover:text-gray-600 hover:border-gray-300 dark:hover:text-gray-300"}`}
                    >
                        <svg className={`w-4 h-4 me-2 ${selectedTab === 'AziendaTab' ? "text-blue-600 dark:text-blue-500" : "text-gray-400 group-hover:text-gray-500 dark:text-gray-500 dark:group-hover:text-gray-300"}`}
                            aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="currentColor" viewBox="0 0 18 18">
                            <path d="M6.143 0H1.857A1.857 1.857 0 0 0 0 1.857v4.286C0 7.169.831 8 1.857 8h4.286A1.857 1.857 0 0 0 8 6.143V1.857A1.857 1.857 0 0 0 6.143 0Zm10 0h-4.286A1.857 1.857 0 0 0 10 1.857v4.286C10 7.169 10.831 8 11.857 8h4.286A1.857 1.857 0 0 0 18 6.143V1.857A1.857 1.857 0 0 0 16.143 0Zm-10 10H1.857A1.857 1.857 0 0 0 0 11.857v4.286C0 17.169.831 18 1.857 18h4.286A1.857 1.857 0 0 0 8 16.143v-4.286A1.857 1.857 0 0 0 6.143 10Zm10 0h-4.286A1.857 1.857 0 0 0 10 11.857v4.286c0 1.026.831 1.857 1.857 1.857h4.286A1.857 1.857 0 0 0 18 16.143v-4.286A1.857 1.857 0 0 0 16.143 10Z" />
                        </svg>
                        Azienda
                    </a>
                </li>
            </ul>
        </div>
    );
}


export default function ContentUserList() {

    const [selectedTab, setSelectedTab] = useState('utentiTab');



    function renderContentTable() {

        console.log("change tab Pag user:", selectedTab);

        switch (selectedTab) {

            case 'utentiTab':
                return <UtentiTable />

            case 'AziendaTab':
                return <AziendaTable />
            default:
                break;
        }

    }

    return (
        <>
            <div className="p-4 sm:ml-64">

                <TabTableUser selectedTab={selectedTab} onSelectTable={setSelectedTab} />


                {renderContentTable()}


            </div>
        </>

    );
}