import { useState } from "react";
import axiosInstance from "./axiosInstance";
import { useNavigate } from "react-router-dom";
 
export default function UserLogin() {
  const [form, setForm] = useState({
    email: "",
    password: "",
  });
 
  const navigate = useNavigate();
 
  const handleLogin = async () => {
    try {
      const res = await axiosInstance.post("/user/login", form);
console.log(res.data)
     
        if(res.data.role === "USER"){
           
            localStorage.setItem("accessToken", res.data.accessToken);
            localStorage.setItem("role", res.data.role);
            navigate("/user-dashboard");
        }
   
    } catch {
      // alert("Invalid user credentials");
    }
  };
 
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <div className="bg-white p-6 rounded-xl shadow w-80">
        <h2 className="text-xl font-bold mb-4 text-center">
          User Login
        </h2>
 
        <input
          className="w-full border p-2 mb-3"
          placeholder="Email"
          onChange={(e) =>
            setForm({ ...form, email: e.target.value })
          }
        />
 
        <input
          type="password"
          className="w-full border p-2 mb-4"
          placeholder="Password"
          onChange={(e) =>
            setForm({ ...form, password: e.target.value })
          }
        />
 
        <button
          onClick={handleLogin}
          className="w-full bg-blue-600 text-white p-2 rounded"
        >
          Login
        </button>
      </div>
    </div>
  );
}
 