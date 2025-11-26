import { useRef, useState } from "react";

interface UploadFileComponentProps {
    getFile: File | undefined;
    setFile: (value: File | undefined) => void; // Definisce onSelect come una funzione che prende una stringa e non restituisce nulla
    setIsOpenModalUpload: (value: boolean) => void;
    Handler: () => void;

}


export default function UploadFile({ getFile, setFile, setIsOpenModalUpload, Handler, }: UploadFileComponentProps) {

    const [fileName, setFileName] = useState<string | null>(null);
    const fileInputRef = useRef<HTMLInputElement | null>(null);

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];

        setFile(file);
        setFileName(file?.name || null);
        console.log(file?.name);
        console.log("file to  upload:", file);
        console.log("get file:", getFile?.name)
    };

    const handleRemoveFile = () => {
        
        setFileName(null);
        setFile(undefined);
        if (fileInputRef.current) {
            fileInputRef.current.value = ''; // Questa riga è fondamentale per resettare l'input
        }
        console.log("remove get file:", getFile?.name)
    };


    return (

        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
            <div className="bg-white text-black w-full max-w-md p-6 rounded-xl shadow-lg">

                <div className="flex justify-between items-center pb-4 mb-4 rounded-t border-b sm:mb-5 dark:border-gray-600">
                    <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                        Upload File
                    </h3>
                    <button onClick={() => setIsOpenModalUpload(false)} type="button" className="text-gray-400 bg-transparent hover:bg-gray-200 hover:text-gray-900 rounded-lg text-sm p-1.5 ml-auto inline-flex items-center dark:hover:bg-gray-600 dark:hover:text-white" data-modal-toggle="updateProductModal">
                        <svg aria-hidden="true" className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg"><path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd"></path></svg>
                        <span className="sr-only">Close modal</span>
                    </button>
                </div>
                <label
                    htmlFor="file-upload"
                    className="flex flex-col items-center justify-center w-full h-40 border-2 border-dashed border-gray-300 rounded-lg cursor-pointer hover:border-blue-500 transition duration-200"
                >
                    <div className="flex flex-col items-center justify-center">
                        <svg
                            className="w-8 h-8 mb-2 text-gray-400"
                            fill="none"
                            stroke="currentColor"
                            strokeWidth={2}
                            viewBox="0 0 24 24"
                        >
                            <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                d="M4 16v1a2 2 0 002 2h12a2 2 0 002-2v-1M12 12V4m0 0L8 8m4-4l4 4"
                            />
                        </svg>
                        <p className="text-sm text-gray-400">
                            Drag &amp; Drop or{" "}
                            <span className="text-blue-400 underline">Choose file</span> to
                            upload
                        </p>
                        <p className="text-xs text-gray-500">Maximum Size: 25MB</p>
                    </div>
                    <input
                        onChange={handleFileChange}
                        ref={fileInputRef}
                        id="file-upload" type="file" className="hidden" />
                </label>
                <div className="my-4 text-center text-gray-500 text-sm">file</div>
                <div className="flex space-x-2">

                    
                    {fileName && (
                        <div className="my-4 text-center w-full text-gray-700 text-sm">
                            <div className="flex items-center space-x-1 p-3 text-base font-bold text-gray-900 rounded-lg bg-gray-50 dark:bg-gray-600 dark:hover:bg-gray-500 dark:text-white">
                                <svg
                                    className="w-8 h-8 fill-current text-blue-600 dark:text-white"
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
                                <span className="flex-1 text-left whitespace-nowrap">{fileName}</span>
                                <button onClick={handleRemoveFile} type="button" className="text-gray-400 bg-transparent hover:bg-red-500 group hover:text-gray-900 rounded-lg text-sm p-1.5 ml-auto inline-flex items-center dark:hover:bg-gray-600 dark:hover:text-white" data-modal-toggle="updateProductModal">
                                    <svg aria-hidden="true" className="w-5 h-5 group-hover:text-white" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg"><path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd"></path></svg>
                                    <span className="sr-only">Rimuovi file</span>
                                </button>
                            </div>
                        </div>
                    )}
                </div>
                <div className="flex justify-end space-x-2 mt-6">
                    <button onClick={() => setIsOpenModalUpload(false)} className="px-4 py-2 text-white bg-gray-700 hover:bg-gray-600 rounded-md text-sm">
                        Cancel
                    </button>
                    <button
                        onClick={async () => {
                            await Handler();
                            setIsOpenModalUpload(false);
                            //Loadfile();
                        }}
                        className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-md text-sm">
                        Upload
                    </button>
                </div>
            </div>
        </div>
    );
}