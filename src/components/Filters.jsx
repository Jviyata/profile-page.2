import styles from "../styles/filter.module.css";

export default function Filters({ roles, roleFilter, setRoleFilter, search, setSearch }) {
  return (
    <div className={styles.filters} data-testid="section-filters">
      <label className={styles.label}>
        Select a title
        <select
          data-testid="select-role"
          value={roleFilter}
          onChange={(e) => setRoleFilter(e.target.value)}
          className={styles.select}
        >
          {roles.map((r) => (
            <option key={r} value={r}>{r}</option>
          ))}
        </select>
      </label>
      <label className={styles.label}>
        Search a name
        <input
          data-testid="input-search"
          type="text"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className={styles.searchInput}
        />
      </label>
      <button
        data-testid="button-clear"
        onClick={() => { setSearch(""); setRoleFilter("All"); }}
        className={styles.clearButton}
      >
        Clear
      </button>
    </div>
  );
}
