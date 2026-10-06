import styles from "./home-company.module.css";

const stats = [
  { value: 8, suffix: "", label: "Years of manufacturing experience" },
  { value: 20000, suffix: " m²", label: "Manufacturing facility" },
  { value: 72, suffix: "h", label: "Aging test" },
  { value: 30, suffix: "+", label: "Countries served worldwide" },
];

export function CompanyStats() {
  return <div className={styles.companyStats}>
    {stats.map((stat, index) => (
      <article key={stat.label}>
        <span className={styles.statIndex}>0{index + 1}</span>
        <strong>{stat.value.toLocaleString("en-US")}<small>{stat.suffix}</small></strong>
        <span className={styles.statLabel}>{stat.label}</span>
      </article>
    ))}
  </div>;
}
