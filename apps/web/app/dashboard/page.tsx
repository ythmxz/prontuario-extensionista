"use client";

import Sidebar from "@/components/Sidebar";
import styles from "./dashboard.module.css";

import {
  Users,
  ClipboardList,
  HeartHandshake,
  FileText,
} from "lucide-react";

import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
} from "recharts";

const data = [
  { name: "Sex", value: 15 },
  { name: "Sáb", value: 22 },
  { name: "Dom", value: 10 },
  { name: "Seg", value: 25 },
  { name: "Ter", value: 12 },
  { name: "Qua", value: 20 },
  { name: "Qui", value: 30 },
];

export default function Dashboard() {
  return (
    <div className={styles.container}>

      <Sidebar />

      <main className={styles.main}>

        <div className={styles.header}>
          <h1>Núcleo Bem Viver</h1>
          <p>Painel de acompanhamento da comunidade</p>
        </div>

        <div className={styles.cards}>

          <Card
            title="Pessoas Atendidas"
            value="1.246"
            growth="+12 este mês"
            color="#2563eb"
            icon={<Users size={18} />}
          />

          <Card
            title="Atendimentos Hoje"
            value="18"
            growth="+3 hoje"
            color="#16a34a"
            icon={<ClipboardList size={18} />}
          />

          <Card
            title="Ações Comunitárias"
            value="32"
            growth="+8 este mês"
            color="#9333ea"
            icon={<HeartHandshake size={18} />}
          />

          <Card
            title="Prontuários"
            value="104"
            growth="+15 este mês"
            color="#ea580c"
            icon={<FileText size={18} />}
          />

        </div>

        <div className={styles.middle}>

          <div className={styles.box}>
            <h3>Atendimentos nos últimos 7 dias</h3>

            <ResponsiveContainer width="100%" height={250}>
              <AreaChart data={data}>
                <XAxis dataKey="name" />
                <YAxis />
                <Tooltip />

                <Area
                  type="monotone"
                  dataKey="value"
                  stroke="#2563eb"
                  fill="#bfdbfe"
                  strokeWidth={3}
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>

          <div className={styles.box}>
            <h3>Atividades Recentes</h3>

            <div className={styles.activity}>
              <div className={styles.iconCircle}>👤</div>
              <span>Novo atendimento cadastrado</span>
            </div>

            <div className={styles.activity}>
              <div className={styles.iconCircle}>📄</div>
              <span>Prontuário atualizado</span>
            </div>
          </div>

        </div>

      </main>
    </div>
  );
}

function Card({ title, value, growth, color, icon }: any) {
  return (
    <div className={styles.card}>
      <div className={styles.cardTop}>
        <p>{title}</p>

        <div className={styles.icon}>
          {icon}
        </div>
      </div>

      <h2>{value}</h2>

      <span className={styles.growth}>
        {growth}
      </span>

      <div
        className={styles.bar}
        style={{ background: color }}
      />
    </div>
  );
}
