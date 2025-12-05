// 'use client';

// import { useState } from 'react';
// import { useRouter } from 'next/navigation'; // ✅ App Router version
// import { auth } from '@/helper/firebase';
// import {
//   createUserWithEmailAndPassword,
//   signInWithEmailAndPassword,
//   updateProfile,
// } from 'firebase/auth';

// export default function AuthForm() {
//   const [isLogin, setIsLogin] = useState(true);
//   const [name, setName] = useState('');
//   const [email, setEmail] = useState('');
//   const [password, setPassword] = useState('');
//   const [error, setError] = useState('');
//   const router = useRouter(); // ✅ for redirecting

//   const handleSubmit = async (e) => {
//     e.preventDefault();
//     setError('');

//     try {
//       if (isLogin) {
//         await signInWithEmailAndPassword(auth, email, password);
//       } else {
//         const userCred = await createUserWithEmailAndPassword(auth, email, password);
//         await updateProfile(userCred.user, {
//           displayName: name,
//         });
//       }

//       // ✅ Redirect to home page after successful auth
//       router.push('/');
//     } catch (err) {
//       setError(err.message);
//     }
//   };

//   return (
//     <div className="max-w-md mx-auto mt-10 p-6 border rounded-xl shadow">
//       <h2 className="text-2xl font-bold text-center mb-6">
//         {isLogin ? 'Login' : 'Sign up for like, comment & subscribe'}
//       </h2>

//       <form onSubmit={handleSubmit} className="space-y-4">
//         {!isLogin && (
//           <input
//             type="text"
//             placeholder="Name"
//             className="w-full p-2 border rounded"
//             value={name}
//             onChange={(e) => setName(e.target.value)}
//             required
//           />
//         )}

//         <input
//           type="email"
//           placeholder="Email"
//           className="w-full p-2 border rounded"
//           value={email}
//           onChange={(e) => setEmail(e.target.value)}
//           required
//         />

//         <input
//           type="password"
//           placeholder="Password"
//           className="w-full p-2 border rounded"
//           value={password}
//           onChange={(e) => setPassword(e.target.value)}
//           required
//         />

//         {error && <p className="text-red-500 text-sm">{error}</p>}

//         <button type="submit" className="w-full bg-blue-600 text-white p-2 rounded hover:bg-blue-700">
//           {isLogin ? 'Login' : 'Create Account'}
//         </button>

//         <p
//           className="text-center text-sm text-blue-500 hover:underline cursor-pointer"
//           onClick={() => setIsLogin(!isLogin)}
//         >
//           {isLogin ? 'Create a new account' : 'Already have an account? Login'}
//         </p>
//       </form>
//     </div>
//   );
// }



"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { auth } from "@/helper/firebase";
import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  updateProfile,
} from "firebase/auth";

export default function AuthForm() {
  const [isLogin, setIsLogin] = useState(true);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const router = useRouter();

  // 🔥 Function to register user in PostgreSQL
  const registerUserInDB = async (token) => {
    try {
      await fetch("/api/auth/registerUser", {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
    } catch (err) {
      console.error("DB Registration Error:", err);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    try {
      let userCred;

      if (isLogin) {
        // 🔹 Login user
        userCred = await signInWithEmailAndPassword(auth, email, password);
      } else {
        // 🔹 Register new user in Firebase
        userCred = await createUserWithEmailAndPassword(auth, email, password);

        // 🔹 Add display name
        await updateProfile(userCred.user, {
          displayName: name,
        });
      }

      // 🔹 Get Firebase ID token
      const token = await userCred.user.getIdToken();

      // 🔥 Register immediately in PostgreSQL
      await registerUserInDB(token);

      // 🔥 Redirect after registration
      router.push("/");
    } catch (err) {
      setError(err.message);
    }
  };

  return (
    <div className="max-w-md mx-auto mt-10 p-6 border rounded-xl shadow">
      <h2 className="text-2xl font-bold text-center mb-6">
        {isLogin ? "Login" : "Sign up for like, comment & subscribe"}
      </h2>

      <form onSubmit={handleSubmit} className="space-y-4">
        {!isLogin && (
          <input
            type="text"
            placeholder="Full Name"
            className="w-full p-2 border rounded"
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
          />
        )}

        <input
          type="email"
          placeholder="Email"
          className="w-full p-2 border rounded"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />

        <input
          type="password"
          placeholder="Password"
          className="w-full p-2 border rounded"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
        />

        {error && <p className="text-red-500 text-sm">{error}</p>}

        <button
          type="submit"
          className="w-full bg-blue-600 text-white p-2 rounded hover:bg-blue-700"
        >
          {isLogin ? "Login" : "Create Account"}
        </button>

        <p
          className="text-center text-sm text-blue-500 hover:underline cursor-pointer"
          onClick={() => setIsLogin(!isLogin)}
        >
          {isLogin ? "Create a new account" : "Already have an account? Login"}
        </p>
      </form>
    </div>
  );
}
