import Link from "next/link";

export default function CadastroPage() {
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

          <form className="register-form">
            <input type="text" placeholder="Nome completo" required />
            <input type="email" placeholder="E-mail" required />
            <input type="text" placeholder="CPF" required />
            <input type="tel" placeholder="Telefone" required />
            <input type="password" placeholder="Senha" required />
            <input type="password" placeholder="Confirmar senha" required />

            <button type="button" className="google-btn">
              <img src="/img/google.png" alt="Google" />
              Cadastrar com Google
            </button>

            <div className="divider">
              <span></span>
              <p>ou</p>
              <span></span>
            </div>

            <button type="submit" className="signup-btn">
              Cadastrar
            </button>

            <p className="login-link">
              Já tem uma conta? <Link href="/login">Entrar</Link>
            </p>
          </form>
        </div>
      </section>
    </main>
  );
}