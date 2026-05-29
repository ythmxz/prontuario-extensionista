"use client";

import Sidebar from "@/components/Sidebar";
import styles from "../dashboard/dashboard.module.css";

import {
  TrendingUp,
  Users,
  ClipboardList,
  HeartHandshake,
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
  { name: "Jan", value: 40 },
  { name: "Fev", value: 55 },
  { name: "Mar", value: 48 },
  { name: "Abr", value: 70 },
  { name: "Mai", value: 82 },
  { name: "Jun", value: 95 },
];

export default function Relatorios() {
  return (
    <div className={styles.container}>

      <Sidebar />

      <main className={styles.main}>

        <div className={styles.header}>
          <h1>Relatórios</h1>
          <p>Visualização do impacto e atendimentos realizados</p>
        </div>

        <div className={styles.cards}>

          <MetricCard
            title="Atendimentos"
            value="1.245"
            growth="+12%"
            icon={<ClipboardList size={18} />}
          />

          <MetricCard
            title="Pessoas Atendidas"
            value="845"
            growth="+8%"
            icon={<Users size={18} />}
          />

          <MetricCard
            title="Famílias Acompanhadas"
            value="312"
            growth="+16%"
            icon={<HeartHandshake size={18} />}
          />

          <MetricCard
            title="Impacto Comunitário"
            value="+23%"
            growth="Este mês"
            icon={<TrendingUp size={18} />}
          />

        </div>

        <div
          style={{
            display: "grid",
            gridTemplateColumns: "2fr 1fr",
            gap: 20,
            marginTop: 20,
          }}
        >

          <div className={styles.box}>

            <h3>Participação da Comunidade</h3>

            <ResponsiveContainer
              width="100%"
              height={320}
            >
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

            <h3>Indicadores</h3>

            <div style={{ marginTop: 25 }}>

              <PerformanceItem
                title="Atendimentos"
                value="82%"
                color="#2563eb"
              />

              <PerformanceItem
                title="Retornos"
                value="64%"
                color="#16a34a"
              />

              <PerformanceItem
                title="Participação"
                value="78%"
                color="#9333ea"
              />

              <PerformanceItem
                title="Acompanhamentos"
                value="74%"
                color="#ea580c"
              />

            </div>

          </div>

        </div>

        <div
          className={styles.box}
          style={{
            marginTop: 20,
          }}
        >

          <h3>Resumo Comunitário</h3>

          <table
            style={{
              width: "100%",
              marginTop: 20,
              borderCollapse: "collapse",
            }}
          >

            <thead>
              <tr
                style={{
                  textAlign: "left",
                  color: "#64748b",
                }}
              >
                <th style={{ paddingBottom: 20 }}>
                  Mês
                </th>

                <th>Atendimentos</th>

                <th>Pessoas</th>

                <th>Famílias Acompanhadas</th>
              </tr>
            </thead>

            <tbody>

              <TableRow
                month="Janeiro"
                consultas="124"
                pacientes="98"
                impacto="84 famílias"
              />

              <TableRow
                month="Fevereiro"
                consultas="156"
                pacientes="112"
                impacto="102 famílias"
              />

              <TableRow
                month="Março"
                consultas="210"
                pacientes="145"
                impacto="128 famílias"
              />

            </tbody>

          </table>

        </div>

      </main>
    </div>
  );
}

function MetricCard({
  title,
  value,
  growth,
  icon,
}: any) {
  return (
    <div className={styles.card}>

      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
        }}
      >
        <p>{title}</p>

        <div className={styles.icon}>
          {icon}
        </div>
      </div>

      <h2 style={{ marginTop: 10 }}>
        {value}
      </h2>

      <span
        style={{
          color: "#16a34a",
          fontSize: 14,
        }}
      >
        {growth}
      </span>

    </div>
  );
}

function PerformanceItem({
  title,
  value,
  color,
}: any) {
  return (
    <div
      style={{
        marginBottom: 20,
      }}
    >

      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          marginBottom: 8,
        }}
      >
        <span>{title}</span>
        <strong>{value}</strong>
      </div>

      <div
        style={{
          width: "100%",
          height: 10,
          background: "#e2e8f0",
          borderRadius: 999,
          overflow: "hidden",
        }}
      >

        <div
          style={{
            width: value,
            height: "100%",
            background: color,
          }}
        />

      </div>

    </div>
  );
}

function TableRow({
  month,
  consultas,
  pacientes,
  impacto,
}: any) {
  return (
    <tr
      style={{
        borderTop: "1px solid #e2e8f0",
      }}
    >

      <td style={{ padding: "18px 0" }}>
        {month}
      </td>

      <td>{consultas}</td>

      <td>{pacientes}</td>

      <td>{impacto}</td>

    </tr>
  );
}