import styles from './Footer.module.css'

export function Footer() {
  const year = new Date().getFullYear()

  return (
    <footer className={styles.footer}>
      <div className={`container ${styles.inner}`}>
        <div className={styles.top}>
          {/* Brand */}
          <div className={styles.brand}>
            <div className={styles.logo}>
              <span className={styles.logoMark}>◈</span>
              <span className={styles.logoText}>Gnos</span>
            </div>
            <p className={styles.tagline}>Conhecimento que move negócios.</p>
          </div>

          {/* Links */}
          <div className={styles.links}>
            <div className={styles.linkGroup}>
              <span className={styles.groupTitle}>Serviços</span>
              <a href="#servicos" className={styles.link}>Automação</a>
              <a href="#servicos" className={styles.link}>Marketing</a>
              <a href="#servicos" className={styles.link}>Software</a>
            </div>
            <div className={styles.linkGroup}>
              <span className={styles.groupTitle}>Empresa</span>
              <a href="#manifesto" className={styles.link}>Sobre</a>
              <a href="#processo"  className={styles.link}>Processo</a>
              <a href="#contato"   className={styles.link}>Contato</a>
            </div>
            <div className={styles.linkGroup}>
              <span className={styles.groupTitle}>Social</span>
              <a href="https://instagram.com/gnos.br" target="_blank" rel="noopener noreferrer" className={styles.link}>Instagram</a>
            </div>
          </div>
        </div>

        <div className={styles.divider} />

        <div className={styles.bottom}>
          <span className={styles.copy}>© {year} Gnos Studio. Todos os direitos reservados.</span>
          <span className={styles.made}>Feito com ◈ no Brasil</span>
        </div>
      </div>
    </footer>
  )
}
