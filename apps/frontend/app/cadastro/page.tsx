"use client";

import { useState, type ChangeEvent, type FormEvent } from "react";
import Link from "next/link";

const apiBaseUrl = process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:3333";

const initialFormState = {
  name: "",
  email: "",
  cpf: "",
  phone: "",
  password: "",
  confirmPassword: "",
};

type Status = "idle" | "loading" | "success" | "error";

export default function CadastroPage() {
  const [formData, setFormData] = useState(initialFormState);
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

    if (formData.password !== formData.confirmPassword) {
      setStatus("error");
      setMessage("As senhas nao conferem.");
      return;
    }

    if (
      !formData.name.trim() ||
      !formData.email.trim() ||
      !formData.cpf.trim() ||
      !formData.phone.trim() ||
      !formData.password
    ) {
      setStatus("error");
      setMessage("Preencha todos os campos obrigatorios.");
      return;
    }

    setStatus("loading");

    try {
      const response = await fetch(`${apiBaseUrl}/users`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          name: formData.name.trim(),
          email: formData.email.trim(),
          cpf: formData.cpf.trim(),
          phone: formData.phone.trim(),
          password: formData.password,
        }),
      });

      if (!response.ok) {
        const payload = await response.json().catch(() => null);
        const serverMessage = payload?.message;

        setStatus("error");
        setMessage(serverMessage ?? "Nao foi possivel realizar o cadastro.");
        return;
      }

      setStatus("success");
      setMessage("Cadastro realizado com sucesso!");
      setFormData(initialFormState);
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
          <h2>Crie sua conta!</h2>
          <div className="line"></div>
          <p>Faça seu cadastro para acessar o sistema do prontuário extensionista</p>
        </div>

        <footer>
          <div className="insta">
            <img src="/img/instagram.png" alt="Instagram" />
            <span>@njbv.oficial</span>
          </div>
        </footer>
      </section>

      <section className="right-side">
        <div className="register-card">
          <div className="user-icon">
            <img src="/img/user.png" alt="Usuário" />
          </div>

          <h2>Criar conta</h2>

          <form className="register-form" onSubmit={handleSubmit}>
            <input
              type="text"
              name="name"
              placeholder="Nome completo"
              value={formData.name}
              onChange={handleChange}
              required
            />
            <input
              type="email"
              name="email"
              placeholder="E-mail"
              value={formData.email}
              onChange={handleChange}
              required
            />
            <input
              type="text"
              name="cpf"
              placeholder="CPF"
              value={formData.cpf}
              onChange={handleChange}
              required
            />
            <input
              type="tel"
              name="phone"
              placeholder="Telefone"
              value={formData.phone}
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
            <input
              type="password"
              name="confirmPassword"
              placeholder="Confirmar senha"
              value={formData.confirmPassword}
              onChange={handleChange}
              required
            />

            <button type="button" className="google-btn">
              <img src="/img/google.png" alt="Google" />
              Cadastrar com Google
            </button>

            <div className="divider">
              <span></span>
              <p>ou</p>
              <span></span>
            </div>

            <button type="submit" className="signup-btn" disabled={isLoading}>
              {isLoading ? "Cadastrando..." : "Cadastrar"}
            </button>

            {message ? (
              <p className={`form-feedback ${status}`} aria-live="polite">
                {message}
              </p>
            ) : null}

            <p className="login-link">
              Já tem uma conta? <Link href="/login">Entrar</Link>
            </p>
          </form>
        </div>
      </section>
    </main>
  );
}
