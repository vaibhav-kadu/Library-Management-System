import axios from 'axios'
import React, { createContext,useContext,useEffect,useState } from "react";


const userContext = createContext()


const authContext = ({children})=>{
    const [user, setUser] = useState(null)
    const [loading, setLoading] = useState(true)

    useEffect(() => {
  const verifyUser = async () => {
    try {
      const token = localStorage.getItem("token");
      const localRole = localStorage.getItem("role"); // fallback for students

      if (token) {
        const response = await axios.get("http://localhost:3000/verify", {
          headers: { Authorization: `Bearer ${token}` },
        });

        if (response.data.success) {
          let verifiedUser = response.data.user;

          // ✅ If role missing (student case), fall back to localStorage
          if (!verifiedUser.role && localRole) {
            verifiedUser = { ...verifiedUser, role: localRole };
          }

          setUser(verifiedUser);
        } else {
          setUser(null);
        }
      } else {
        setUser(null);
      }
    } catch (error) {
      console.error("Verify error:", error);
      setUser(null);
    } finally {
      setLoading(false);
    }
  };

  verifyUser();
}, []);


    const login = (user) =>{
        setUser(user)

    }

    const logout =()=>{
        setUser(null)
        localStorage.removeItem("token")
        localStorage.removeItem("role")

    }

    return(
        <userContext.Provider value={{user,login,logout,loading}}>
            {children}

        </userContext.Provider>
    )
}

export const useAuth=()=> useContext(userContext)

export default authContext