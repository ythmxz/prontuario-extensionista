"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";

const initialFormState = {
  email: "",
  password: "",
};

export default function LoginPage() {
  const [formData, setFormData] = useState(initialFormState);

  const handleChange = (event: ChangeEvent<HTMLInputElement>) => {
    const { name, value } = event.target;

    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
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

          <form className="register-form">
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
          </form>

          <Link href="/" className="signup-btn">
            Entrar
          </Link>

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
