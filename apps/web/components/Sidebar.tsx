"use client";

import { useEffect, useState, ReactNode } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  Home,
  FileText,
  BarChart2,
  Calendar,
  User,
  Settings,
} from "lucide-react";

import styles from "@/app/dashboard/dashboard.module.css"; // TODO: não devia ser da dashboard. Mover para outro lugar...
import { API_URL, getWithAuth } from "@/app/common";

/**
 * Barra de navegação
 */
export default function Sidebar() {
  const pathname = usePathname();
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
    href: string,
  };

  // TODO: usar "className={styles.active}" na rota atual

  const items: Item[] = [
    { title: "Início 🚧", icon: (<Home size={18}/>), href: "/dashboard" },
    { title: "Prontuários 🚧", icon: (<FileText size={18}/>), href: "/prontuarios" },
    { title: "Relatórios 🚧", icon: (<BarChart2 size={18}/>), href: "/relatorios" },
    { title: "Agenda 🚧", icon: (<Calendar size={18}/>), href: "/agenda" },
    { title: "Pacientes 🚧", icon: (<User size={18}/>), href: "/pacientes" },
    { title: "Configurações 🚧", icon: (<Settings size={18}/>), href: "/configuracoes" },

    // rotas experimentais / de teste
    { title: "HomeFidelis ❗", icon: (<Home size={18}/>), href: "/home" },
  ];

  return (
    <aside className={styles.sidebar}>
      <div>
        <div className={styles.logo}>
          <span>Prontuário NJBV</span>
        </div>

        <ul className={styles.menu}>
          {items.map((i) => {
            const isActive =
              pathname === i.href || (pathname && pathname.startsWith(`${i.href}/`));

            return (
              <Link href={i.href} key={i.title}>
                <li className={isActive ? styles.active : undefined}>
                  {i.icon}
                  {i.title}
                </li>
              </Link>
            );
          })}
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
