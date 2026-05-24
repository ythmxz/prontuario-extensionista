import Link from "next/link";

export default function LoginPage() {
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

          <button type="button" className="google-btn">
            <img src="/img/google.png" alt="Google" />
            Continue com Google
          </button>

          <div className="divider">
            <span></span>
            <p>ou</p>
            <span></span>
          </div>

          <Link href="/cadastro" className="signup-btn">
            Cadastre-se
          </Link>
        </div>
      </section>
    </main>
  );
}