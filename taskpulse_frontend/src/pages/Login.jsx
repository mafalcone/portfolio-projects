import { useState } from "react";
import { useAuth } from "../contexts/AuthContext";
import { api } from "../services/api";

export default function Login() {
  const { login } = useAuth();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);

  async function handleLogin(e) {
    e.preventDefault();
    setError(null);
    setLoading(true);
    try {
      await login(email, password);
    } catch {
      setError("Login failed");
    } finally {
      setLoading(false);
    }
  }

  async function handleRegister(e) {
    e.preventDefault();
    setError(null);
    setLoading(true);
    try {
      await api.post("/auth/register", { email, password });
      alert("Usuario creado. Ahora podés loguearte.");
    } catch (err) {
      setError(err.response?.data?.error || "Register failed");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div style={{ maxWidth: 420, margin: "80px auto" }}>
      <h2>TaskPulse</h2>

      <form>
        <input
          placeholder="Email"
          value={email}
          onChange={e => setEmail(e.target.value)}
        />
        <br />
        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={e => setPassword(e.target.value)}
        />
        <br />

        {error && <p style={{ color: "red" }}>{error}</p>}

        <button onClick={handleLogin} disabled={loading}>
          Login
        </button>

        <button
          onClick={handleRegister}
          disabled={loading}
          style={{ marginLeft: 8 }}
        >
          Register
        </button>
      </form>
    </div>
  );
}
