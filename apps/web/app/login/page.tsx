"use client";

import { useState, useEffect, type ChangeEvent, type FormEvent } from "react";
import { API_URL } from "../common";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";

const initialFormState = {
  email: "",
  password: "",
};

type Status = "idle" | "loading" | "success" | "error";

export default function LoginPage() {
  const router = useRouter();
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

  const [returnTo, setReturnTo] = useState<string | null>();

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    setReturnTo(params.get("returnTo"));
  }, []);

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setMessage("");

    if (!formData.email.trim() || !formData.password.trim()) {
      setStatus("error");
      setMessage("Preencha todos os campos obrigatorios.");
      return;
    }

    setStatus("loading");

    try {
      const response = await fetch(`${API_URL}/auth/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          email: formData.email.trim(),
          password: formData.password.trim(),
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        setStatus("error");
        setMessage(data.message ?? "Nao foi possivel realizar o cadastro");
        return;
      }

      // TODO: conselho do gpt: "Em produção, prefira guardar o token em cookie HttpOnly, Secure e SameSite, em vez de localStorage; assim, o JavaScript da página não consegue ler o token."
      localStorage.setItem("token", data.token);
      setStatus("success");
      setMessage("Entrou!");

      const destination = returnTo?.startsWith("/") && !returnTo.startsWith("//")
        ? returnTo
        : "/dashboard";
      router.replace(destination);
    } catch (erro) {
      console.log(erro);
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
              <Image width={48} height={48} src="/img/c.png" alt="Coração" />
            </div>

            <div>
              <span>NJBV</span>
              <h1>Prontuário Extensionista</h1>
              <p>Núcleo Jovem Bom de Vida</p>
            </div>
          </div>

          <div className="logos">
            <Image width={83} height={83} src="/img/uesc.png" alt="UESC" className="logo-uesc" />
            <Image width={77} height={167} src="/img/njbv.png" alt="NJBV" className="logo-njbv" />
          </div>
        </header>

        <div className="welcome">
          <h2>Bem vindo de volta!</h2>
          <div className="line"></div>
          <p>Faça o login para acessar o sistema do prontuário extensionista</p>
        </div>

        <footer>
          <div className="insta">
            <Image width={27} height={27} src="/img/instagram.png" alt="Instagram" />
            <span>@njbv.oficial</span>
          </div>
        </footer>
      </section>

      <section className="right-side">
        <div className="login-card">
          <div className="user-icon">
            <Image width={66} height={66} src="/img/user.png" alt="Usuário" />
          </div>

          <h2>Entrar na sua conta</h2>

          {returnTo ? (
            <p className={`form-feedback ${status}`} aria-live="polite">
              Por favor faça o login antes de acessar a página.
            </p>
          ) : null}

          <form className="register-form" onSubmit={handleSubmit}>
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
            <Image width={48} height={48} src="/img/google.png" alt="Google" />
            Continue com Google
          </button>

          <Link href="/cadastro" className="signup-btn">
            Cadastre-se
          </Link>
        </div>
      </section>
    </main>
  );
}
