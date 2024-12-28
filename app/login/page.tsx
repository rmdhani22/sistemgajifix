'use client';

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { FaUser, FaLock } from "react-icons/fa";
import { AiFillEye, AiFillEyeInvisible } from "react-icons/ai";
import '../globals.css';

const LoginPage = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const router = useRouter();

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  const handleLogin = async () => {
    const response = await fetch('/api/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ username, password }),
    });

    if (response.ok) {
      const data = await response.json();
      console.log(data)
      localStorage.setItem('token', data.token);
      router.push('/dashboard');
    } else {
      alert('Username atau password salah!');
    }
    
  };

  return (
    <div className="login">
      <div className="login-container">
        <div className="login-form">
          <div className="avatar">
            <img src="/bubu.png" />
          </div>
          <h1>LOGIN KE AKUN ANDA</h1>
          <div className="input-group">
            <span className="icon">
              <FaUser />
            </span>
            <input
              type="text"
              placeholder="Username"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
            />
          </div>
          <div className="input-group">
            <span className="icon">
              <FaLock />
            </span>
            <input
              type={showPassword ? "text" : "password"}
              placeholder="Kata Sandi"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
            <span className="icon-eye" onClick={togglePasswordVisibility}>
              {showPassword ? <AiFillEyeInvisible /> : <AiFillEye />}
            </span>
          </div>
          <button className="button-login" onClick={handleLogin}>LOGIN</button>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;