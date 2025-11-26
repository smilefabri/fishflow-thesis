//import { useEffect, useState } from "react";
import '@aws-amplify/ui-react/styles.css';
import LoginForm from './module/auth/signIn';
/* import RegisterForm from './module/auth/RegisterForm'; */
import { Routes, Route, } from 'react-router-dom';
/* import ConfirmSingUp from './module/auth/confirmSingUp'; */
import ProtectedRoutes from './module/auth/privateRoute';
import AdimnHome from './pages/adminHome'
import ConfirmSingIn from './module/auth/confirmSignIn';
import UserHome from './pages/userHome';
import Page404 from './pages/404Page';
import ProtectedRoutesAdmin from './module/auth/PrivateRouteAdmin';

function App() {

  return (
    <Routes>

      <Route path='/login' element={<LoginForm />}></Route>
      {/* <Route path='/register' element={<RegisterForm/>}/> */}
      {/* <Route path='/singup/confirm' element={<ConfirmSingUp/>}/> */}
      <Route path='/signin/confirm' element={<ConfirmSingIn />} />
      <Route element={<ProtectedRoutes />}>


        <Route element={<ProtectedRoutesAdmin/>}>
          <Route path='/admin' element={<AdimnHome />} />

        </Route>

        <Route path='/user/*' element={<UserHome />} />
        <Route path="*" element={<Page404 />} />
        <Route path='/admin_azienda' />

      </Route>

    </Routes>
  );
}

export default App;
