"use client";

import { useEffect, useState, ReactNode } from "react";
import Link from "next/link";
import {
  Home,
  FileText,
  BarChart2,
  Calendar,
  User,
  Settings,
} from "lucide-react";

import styles from "@/app/dashboard/dashboard.module.css"; // TODO: não devia ser da dashboard. Mover para outro lugar...
import { API_URL, getWithAuth, logOut } from "@/app/common";

/**
 * Barra de navegação lateral do aplicativo. Contém as rotas principais e algumas informações sobre a conta.
 */
export default function Sidebar() {
  const [userName, setUserName] = useState<string>("");

  useEffect(() => {
    async function loadData() {
      try {
        const response = await getWithAuth(`${API_URL}/auth/info`);

        if (!response.ok) {
          console.log("TODO: handle error");
          return;
        }

        const json = await response.json();
        setUserName(json.name);
      } catch (error) {
        console.log("TODO: handle error");
      }
    }

    loadData();
  }, []);

  type Item = {
    title: string,
    icon: ReactNode,
    href?: string,
    onClick?: () => void,
  };

  // TODO: usar "className={styles.active}" na rota atual

  const items: Item[] = [
    { title: "Início 🚧", icon: (<Home size={18}/>), href: "/dashboard" },
    { title: "Prontuários 🚧", icon: (<FileText size={18}/>), href: "/prontuarios" },
    { title: "Relatórios 🚧", icon: (<BarChart2 size={18}/>), href: "/relatorios" },
    { title: "Agenda 🚧", icon: (<Calendar size={18}/>), href: "/agenda" },
    { title: "Pacientes", icon: (<User size={18}/>), href: "/pacientes" },
    { title: "Configurações 🚧", icon: (<Settings size={18}/>), href: "/configuracoes" },

    // rotas experimentais / de teste
    { title: "HomeFidelis ❗", icon: (<Home size={18}/>), href: "/home" },
    { title: "Sair da conta ❗", icon: (<Home size={18}/>), onClick: logOut },
  ];

  return (
    <aside className={styles.sidebar}>
      <div>
        <div className={styles.logo}>
          <span>Prontuário NJBV</span>
        </div>

        <ul className={styles.menu}>
          {items.map(i => (
            <Link href={i.href ?? ""} onClick={i.onClick} key={i.title}>
              <li>
                {i.icon}
                {i.title}
              </li>
            </Link>
          ))}

        </ul>
      </div>

      <div className={styles.user}>
        <div className={styles.avatar}>N</div>

        <div>
          <strong>{userName}</strong>
          <p style={{ fontSize: 12 }}>
            Usuário
          </p>
        </div>
      </div>
    </aside>
  );
}
