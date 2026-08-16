import type { Metadata } from "next";
import { supabaseAdmin } from "@/lib/supabase-admin";
import ProductRow from "./ProductRow";
import styles from "../table.module.css";

export const metadata: Metadata = {
  title: "Products — Admin",
  robots: { index: false, follow: false },
};

async function getProducts() {
  const { data, error } = await supabaseAdmin
    .from("skincare_products")
    .select("id, step, slug, title, description")
    .order("step");

  if (error) {
    console.error("Failed to load skincare products:", error.message);
    return [];
  }

  return data;
}

export default async function AdminProductsPage() {
  const products = await getProducts();

  return (
    <section>
      <div className={styles.header}>
        <h1 className={styles.title}>Skincare products</h1>
        <span className={styles.count}>
          {products.length} {products.length === 1 ? "product type" : "product types"}
        </span>
      </div>

      {products.length === 0 ? (
        <p className={styles.empty}>No product types yet.</p>
      ) : (
        <div className={styles.tableWrap}>
          <table className={styles.table}>
            <thead>
              <tr>
                <th>Step</th>
                <th>Slug</th>
                <th>Title</th>
                <th>Description</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {products.map((product) => (
                <ProductRow key={product.id} product={product} />
              ))}
            </tbody>
          </table>
        </div>
      )}
    </section>
  );
}
