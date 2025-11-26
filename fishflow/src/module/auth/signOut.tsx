import { signOut } from "aws-amplify/auth";
import outputs from "../../../amplify_outputs.json"
import { Amplify } from "aws-amplify"
import { useNavigate } from "react-router-dom";

Amplify.configure(outputs)


export default function SignOutComponent() {

    const navigate = useNavigate();


    async function handlerSignOut() {
        await signOut();
        navigate("/login");
    }

    return (

        <div className="flex-col hover:cursor-pointer" onClick={handlerSignOut} >
            <div className="flex justify-center items-center bg-blue-600 hover:bg-blue-700   p-2 text-gray-900 rounded-lg dark:text-white  hover:text-white dark:hover:bg-gray-700 group">
                <svg className="w-6 h-6 text-white " aria-hidden="true" xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="none" viewBox="0 0 24 24">
                    <path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M20 12H8m12 0-4 4m4-4-4-4M9 4H7a3 3 0 0 0-3 3v10a3 3 0 0 0 3 3h2" />
                </svg>
                <span className="font-sans ms-3 text-white whitespace-nowrap"> Logout</span>
            </div>
        </div>

    );
}