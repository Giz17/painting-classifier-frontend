import React, { useState, useEffect } from "react";
import { useSearchParams, useNavigate } from "react-router-dom";
import { supabase } from "../lib/supabase";

const ResetPasswordPage = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const [password, setPassword] = useState("");
  const [info, setInfo] = useState("");
  const [error, setError] = useState("");

  useEffect(() => {
    // Supabase automatically signs the user in when they click the reset link
    // So you can call updateUser without re-authentication
  }, []);

  const handlePasswordReset = async () => {
    setError("");
    setInfo("");

    const { error } = await supabase.auth.updateUser({
      password,
    });

    if (error) {
      setError(error.message);
    } else {
      setInfo("Password updated! Redirecting to login...");
      setTimeout(() => navigate("/"), 2000);
    }
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100">
      <h2 className="text-2xl font-bold mb-4">Set Your New Password</h2>
      <input
        type="password"
        placeholder="New Password"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        className="border p-2 rounded mb-3"
      />
      {error && <p className="text-red-500">{error}</p>}
      {info && <p className="text-green-500">{info}</p>}
      <button
        onClick={handlePasswordReset}
        className="bg-blue-500 text-white px-4 py-2 rounded"
      >
        Update Password
      </button>
    </div>
  );
};

export default ResetPasswordPage;
