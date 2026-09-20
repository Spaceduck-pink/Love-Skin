import type { Metadata } from "next";
import Link from "next/link";
import { supabaseAdmin } from "@/lib/supabase-admin";
import { deleteConcern, deleteSkinType } from "@/lib/admin-skin-profile-actions";
import DeleteRowButton from "./DeleteRowButton";
import styles from "../table.module.css";

export const metadata: Metadata = {
  title: "Skin Profile — Admin",
  robots: { index: false, follow: false },
};

interface SkinTypeRow {
  id: string;
  sort_order: number;
  slug: string;
  title: string;
  tagline: string;
}

interface ConcernRow {
  id: string;
  sort_order: number;
  slug: string;
  title: string;
  tagline: string;
}

async function getSkinTypes(): Promise<SkinTypeRow[]> {
  const { data, error } = await supabaseAdmin
    .from("skin_types")
    .select("id, sort_order, slug, title, tagline")
    .order("sort_order");

  if (error) {
    console.error("Failed to load skin types:", error.message);
    return [];
  }

  return data;
}

async function getConcerns(): Promise<ConcernRow[]> {
  const { data, error } = await supabaseAdmin
    .from("skin_concerns")
    .select("id, sort_order, slug, title, tagline")
    .order("sort_order");

  if (error) {
    console.error("Failed to load skin concerns:", error.message);
    return [];
  }

  return data;
}

export default async function AdminSkinProfilePage() {
  const [skinTypes, concerns] = await Promise.all([getSkinTypes(), getConcerns()]);

  return (
    <>
      <section>
        <div className={styles.header}>
          <h1 className={styles.title}>Skin types</h1>
          <span className={styles.count}>
            {skinTypes.length} {skinTypes.length === 1 ? "skin type" : "skin types"}
          </span>
        </div>

        {skinTypes.length === 0 ? (
          <p className={styles.empty}>No skin types yet.</p>
        ) : (
          <div className={styles.tableWrap}>
            <table className={styles.table}>
              <thead>
                <tr>
                  <th>Order</th>
                  <th>Slug</th>
                  <th>Title</th>
                  <th>Tagline</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {skinTypes.map((type) => (
                  <tr key={type.id}>
                    <td>{String(type.sort_order).padStart(2, "0")}</td>
                    <td className={styles.muted}>{type.slug}</td>
                    <td>{type.title}</td>
                    <td className={styles.muted}>{type.tagline}</td>
                    <td>
                      <div className={styles.actions}>
                        <Link href={`/admin/skin-profile/types/${type.id}`} className={styles.actionBtn}>
                          Edit
                        </Link>
                        <DeleteRowButton id={type.id} label={type.title} action={deleteSkinType} />
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </section>

      <section style={{ marginTop: "3rem" }}>
        <div className={styles.header}>
          <h1 className={styles.title}>Skin concerns</h1>
          <span className={styles.count}>
            {concerns.length} {concerns.length === 1 ? "concern" : "concerns"}
          </span>
        </div>

        {concerns.length === 0 ? (
          <p className={styles.empty}>No concerns yet.</p>
        ) : (
          <div className={styles.tableWrap}>
            <table className={styles.table}>
              <thead>
                <tr>
                  <th>Order</th>
                  <th>Slug</th>
                  <th>Title</th>
                  <th>Tagline</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {concerns.map((concern) => (
                  <tr key={concern.id}>
                    <td>{String(concern.sort_order).padStart(2, "0")}</td>
                    <td className={styles.muted}>{concern.slug}</td>
                    <td>{concern.title}</td>
                    <td className={styles.muted}>{concern.tagline}</td>
                    <td>
                      <div className={styles.actions}>
                        <Link
                          href={`/admin/skin-profile/concerns/${concern.id}`}
                          className={styles.actionBtn}
                        >
                          Edit
                        </Link>
                        <DeleteRowButton id={concern.id} label={concern.title} action={deleteConcern} />
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </section>
    </>
  );
}
