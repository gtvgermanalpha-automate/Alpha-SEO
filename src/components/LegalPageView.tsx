import { PageHero } from "@/components/PageHero";
import { Md } from "@/components/ArticleBody";
import { CustomSchema } from "@/components/CustomSchema";
import { type LegalPage } from "@/lib/content";

/** Shared renderer for the Privacy / Terms / Cookies pages. Ported to the
 *  original static-site article layout (.page-header + .article-body). */
export function LegalPageView({ page }: { page: LegalPage }) {
  return (
    <>
      <PageHero crumb={page.crumb} title={page.title} subtitle={page.intro} />
      <section className="section">
        <div className="container container-article">
          <p style={{ fontSize: "var(--small)", color: "var(--ink-faint)", marginBottom: "1.5rem" }}>{page.updated}</p>
          <div className="article-body">
            {page.sections.map((s) => (
              <div key={s.heading}>
                <h2>{s.heading}</h2>
                {s.body.length ? <Md>{s.body.join("\n\n")}</Md> : null}
                {s.bullets ? <ul>{s.bullets.map((b) => <li key={b}>{b}</li>)}</ul> : null}
              </div>
            ))}
          </div>
        </div>
      </section>
      <CustomSchema route={`/${page.slug}`} />
    </>
  );
}
