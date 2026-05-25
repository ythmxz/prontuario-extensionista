"use client";

import { useState, type ChangeEvent, type FormEvent } from "react";
import Link from "next/link";

const apiBaseUrl = process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:3333";

type Status = "idle" | "loading" | "success" | "error";

export default function LoginPage() {
  const [formData, setFormData] = useState({ email: "", password: "" });
  const [status, setStatus] = useState<Status>("idle");
  const [message, setMessage] = useState("");
  const isLoading = status === "loading";

  const handleChange = (event: ChangeEvent<HTMLInputElement>) => {
    const { name, value } = event.target;

    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setMessage("");

    if (!formData.email.trim() || !formData.password) {
      setStatus("error");
      setMessage("Email e senha sao obrigatorios.");
      return;
    }

    setStatus("loading");

    try {
      const response = await fetch(`${apiBaseUrl}/auth/login`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          email: formData.email.trim(),
          password: formData.password,
        }),
      });

      if (!response.ok) {
        const payload = await response.json().catch(() => null);
        const serverMessage = payload?.message;

        setStatus("error");
        setMessage(serverMessage ?? "Nao foi possivel fazer login.");
        return;
      }

      setStatus("success");
      setMessage("Login realizado com sucesso!");
      setFormData({ email: "", password: "" });
    } catch (error) {
      setStatus("error");
      setMessage("Nao foi possivel conectar ao servidor.");
    }
  };

  return (
    <main className="container">
      <section className="left-side">
        <header className="top">
          <div className="brand">
            <div className="heart">
              <img src="/img/c.png" alt="Coração" />
            </div>

            <div>
              <span>NJBV</span>
              <h1>Prontuário Extensionista</h1>
              <p>Núcleo Jovem Bom de Vida</p>
            </div>
          </div>

          <div className="logos">
            <img src="/img/uesc.png" alt="UESC" className="logo-uesc" />
            <img src="/img/njbv.png" alt="NJBV" className="logo-njbv" />
          </div>
        </header>

        <div className="welcome">
          <h2>Bem vindo de volta!</h2>
          <div className="line"></div>
          <p>Faça o login para acessar o sistema do prontuário extensionista</p>
        </div>

        <footer>
          <div className="insta">
            <img src="/img/instagram.png" alt="Instagram" />
            <span>@njbv.oficial</span>
          </div>
        </footer>
      </section>

      <section className="right-side">
        <div className="login-card">
          <div className="user-icon">
            <img src="/img/user.png" alt="Usuário" />
          </div>

          <h2>Entrar na sua conta</h2>

          <form className="login-form" onSubmit={handleSubmit}>
            <input
              type="email"
              name="email"
              placeholder="E-mail"
              value={formData.email}
              onChange={handleChange}
              required
            />
            <input
              type="password"
              name="password"
              placeholder="Senha"
              value={formData.password}
              onChange={handleChange}
              required
            />

            <button type="submit" className="signup-btn" disabled={isLoading}>
              {isLoading ? "Entrando..." : "Entrar"}
            </button>

            {message ? (
              <p className={`form-feedback ${status}`} aria-live="polite">
                {message}
              </p>
            ) : null}
          </form>

          <div className="divider">
            <span></span>
            <p>ou</p>
            <span></span>
          </div>

          <button type="button" className="google-btn">
            <img src="/img/google.png" alt="Google" />
            Continue com Google
          </button>

          <p className="login-link">
            Nao tem uma conta? <Link href="/cadastro">Cadastre-se</Link>
          </p>
        </div>
      </section>
    </main>
  );
}
