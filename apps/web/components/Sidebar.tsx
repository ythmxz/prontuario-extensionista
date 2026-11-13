"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import styles from "../app/dashboard/dashboard.module.css";
import {
  Home,
  FileText,
  BarChart2,
  Calendar,
  User,
  Settings,
} from "lucide-react";
import { API_URL } from "../app/common";

function getWithAuth(url: string): Promise<Response> {
  const token = localStorage.getItem("token");
  // TODO: verificar se tem o token mesmo
  const headers = { Authorization: `Bearer ${token}` };
  return fetch(url, { headers });
}

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

  return (
    <aside className={styles.sidebar}>

      <div>
        <div className={styles.logo}>
          <span>🧡</span>
          <span>NJBV Saúde</span>
        </div>

        <ul className={styles.menu}>

          <li className={styles.active}>
            <Link href="/dashboard">
              <Home size={18} />
              Início
            </Link>
          </li>

          <li>
            <Link href="/prontuarios">
              <FileText size={18} />
              Prontuários
            </Link>
          </li>

          <li>
            <Link href="/relatorios">
              <BarChart2 size={18} />
              Relatórios
            </Link>
          </li>

          <li>
            <Link href="/agenda">
              <Calendar size={18} />
              Agenda
            </Link>
          </li>

          <li>
            <Link href="/pacientes">
              <User size={18} />
              Pacientes
            </Link>
          </li>

          <li>
            <Link href="/configuracoes">
              <Settings size={18} />
              Configurações
            </Link>
          </li>

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
