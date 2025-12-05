// import AuthForm from '@/component/authForm';
// import Navbar from '@/component/navbar';

// export default function LoginPage() {
//   return(
//   <>
//     <Navbar />
//     <AuthForm />;
//   </> 
//   )
// }


import AuthForm from '@/component/authForm';
import AuthNavbar from '@/component/AuthNavbar';

export default function LoginPage() {
  return (
    <>
      <AuthNavbar/>
      <AuthForm />
    </>
  );
}
