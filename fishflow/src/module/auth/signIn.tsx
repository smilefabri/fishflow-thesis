import { signIn, fetchAuthSession } from "aws-amplify/auth";
import { useState } from "react";
import { useNavigate } from "react-router-dom";


export default function LoginForm() {


  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const navigate = useNavigate();



  const handlerSignIn = async (e: React.FormEvent) => {
    e.preventDefault();
    try {

      const { nextStep } = await signIn(
        {
          username: email,
          password: password
        }
      )

      console.log("ti sei logato?", nextStep);

      let route = "/user";

      const fetchSessionResult = await fetchAuthSession(); // will return the credentials
      console.log('fetchSessionResult: ', fetchSessionResult);

      const groups = fetchSessionResult?.tokens?.idToken?.payload['cognito:groups'];

      if (Array.isArray(groups) && groups.every(group => typeof group === 'string')) {
        // 'groups' è un array di stringhe
        const userGroups: string[] = groups;


        if (userGroups.includes('ADMIN')) {
          route = "/admin"
        } else if (userGroups.includes('ADMIN_AZIENDA')) {
          route = "/login"
        }

        console.log('Gruppi dell\'utente:', userGroups);
      } else {
        // 'groups' non è definito o non è un array di stringhe
        console.log('Nessun gruppo disponibile o formato non valido.');
      }

      console.log("msg<INFO>:", nextStep.signInStep)
      console.log("msg<INFO>: Risultato signIn:", nextStep);

      switch (nextStep.signInStep) {

        case "CONFIRM_SIGN_IN_WITH_NEW_PASSWORD_REQUIRED":
          console.log("msg<INFO> switch case:", nextStep.signInStep)
          navigate("/signin/confirm");

          break;
        case "DONE":

          console.log("msg<INFO>: login as: ", route);
          navigate(route);

          break;
        default:
          break;
      }

    } catch (error) {

      console.log('error durante l\'accesso:', error)
    }
  }


  return (
    <section className="bg-gray-50 dark:bg-gray-900">
      <div className="flex flex-col items-center justify-center px-6 py-8 mx-auto md:h-screen lg:py-0">
        <a
          href="#"
          className="flex items-center mb-6 text-2xl font-semibold text-gray-900 dark:text-white"
        >
          <img
            className="w-8 h-8 mr-2"
            src="https://flowbite.s3.amazonaws.com/blocks/marketing-ui/logo.svg"
            alt="logo"
          />
          FishFlow
        </a>
        <div className="w-full bg-white rounded-lg shadow dark:border md:mt-0 sm:max-w-md xl:p-0 dark:bg-gray-800 dark:border-gray-700">
          <div className="p-6 space-y-4 md:space-y-6 sm:p-8">
            <h1 className="text-xl font-bold leading-tight tracking-tight text-gray-900 md:text-2xl dark:text-white">
              Sign in to your account
            </h1>
            <form onSubmit={handlerSignIn} className="space-y-4 md:space-y-6" action="#">
              <label htmlFor="input-group-1" className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Email</label>
              <div className="relative mb-6">
                <div className="absolute inset-y-0 start-0 flex items-center ps-3.5 pointer-events-none">
                  <svg className="w-4 h-4 text-gray-500 dark:text-gray-400" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="currentColor" viewBox="0 0 20 16">
                    <path d="m10.036 8.278 9.258-7.79A1.979 1.979 0 0 0 18 0H2A1.987 1.987 0 0 0 .641.541l9.395 7.737Z" />
                    <path d="M11.241 9.817c-.36.275-.801.425-1.255.427-.428 0-.845-.138-1.187-.395L0 2.6V14a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2V2.5l-8.759 7.317Z" />
                  </svg>
                </div>
                <input onChange={(e) => setEmail(e.target.value)} type="text" id="input-group-1" className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full ps-10 p-2.5  dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500" placeholder="name@email.com" />
              </div>
              <label htmlFor="input-group-1" className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Password</label>
              <div className="relative mb-6">
                <div className="absolute inset-y-0 start-0 flex items-center ps-3.5 pointer-events-none">
                  <svg className="w-5 h-5 text-gray-500 dark:text-gray-400" aria-hidden="true"  xmlns="http://www.w3.org/2000/svg" fill="currentColor" viewBox="3 0  16 25">
                    <path d="M 6.5625 5.0136719 C 2.4595703 5.2668613 -0.68726562 9.0536406 0.13085938 13.369141 C 0.65285938 16.124141 2.8748594 18.347141 5.6308594 18.869141 C 9.378008 19.579519 12.720128 17.298793 13.703125 14 L 18 14 L 18 15 C 18 16.105 18.895 17 20 17 C 21.105 17 22 16.105 22 15 L 22 14 C 23.105 14 24 13.105 24 12 C 24 10.895 23.105 10 22 10 L 13.699219 10 C 12.979424 7.5432523 10.909496 5.6120152 8.3691406 5.1308594 C 7.7527656 5.0139844 7.1486328 4.977502 6.5625 5.0136719 z M 7 9 C 8.657 9 10 10.343 10 12 C 10 13.657 8.657 15 7 15 C 5.343 15 4 13.657 4 12 C 4 10.343 5.343 9 7 9 z"></path>
                  </svg>

                </div>
                <input onChange={(e) => setPassword(e.target.value)} type="password" id="input-group-2" className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full ps-10 p-2.5  dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500" placeholder="password" />
              </div>

              <div className="flex items-center justify-between">
                <div className="flex items-start">
                  <div className="flex items-center h-5">
                    <input
                      id="remember"
                      aria-describedby="remember"
                      type="checkbox"
                      className="w-4 h-4 border border-gray-300 rounded bg-gray-50 focus:ring-3 focus:ring-primary-300 dark:bg-gray-700 dark:border-gray-600 dark:focus:ring-primary-600 dark:ring-offset-gray-800"

                    />
                  </div>
                  <div className="ml-3 text-sm">
                    <label
                      htmlFor="remember"
                      className="text-gray-500 dark:text-gray-300"
                    >
                      Remember me
                    </label>
                  </div>
                </div>
                <a
                  href="#"
                  className="text-sm font-medium text-primary-600 hover:underline dark:text-primary-500"
                >
                  Forgot password?
                </a>
              </div>
              <button
                type="submit"

                className="w-full text-white bg-primary-600 hover:bg-primary-700 focus:ring-4 focus:outline-none focus:ring-primary-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center dark:bg-primary-600 dark:hover:bg-primary-700 dark:focus:ring-primary-800"
              >
                Sign in
              </button>

            </form>
          </div>
        </div>
      </div>
    </section>
  );
}
