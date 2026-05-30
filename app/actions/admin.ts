"use server";

import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";
import {
  createAdminSession,
  destroyAdminSession,
  requireAdmin,
} from "@/lib/auth";
import { db } from "@/lib/db";
import { slugify } from "@/lib/utils";

export async function adminLogin(
  _prevState: { error: string } | null,
  formData: FormData
): Promise<{ error: string } | null> {
  const password = formData.get("password") as string;

  if (!password || password !== process.env.ADMIN_PASSWORD) {
    return { error: "Невірний пароль" };
  }

  await createAdminSession();
  redirect("/admin");
}

export async function adminLogout() {
  await destroyAdminSession();
  redirect("/admin/login");
}

export async function createCategory(formData: FormData) {
  await requireAdmin();

  const name = formData.get("name") as string;
  const description = (formData.get("description") as string) || null;
  const image = (formData.get("image") as string) || null;
  const sortOrder = parseInt((formData.get("sortOrder") as string) || "0", 10);

  const slug = slugify(name);

  await db.category.create({
    data: { name, slug, description, image, sortOrder },
  });

  revalidatePath("/");
  revalidatePath("/shop");
  revalidatePath("/admin/categories");
  redirect("/admin/categories");
}

export async function updateCategory(formData: FormData) {
  await requireAdmin();

  const id = formData.get("id") as string;
  const name = formData.get("name") as string;
  const description = (formData.get("description") as string) || null;
  const image = (formData.get("image") as string) || null;
  const sortOrder = parseInt((formData.get("sortOrder") as string) || "0", 10);

  await db.category.update({
    where: { id },
    data: { name, description, image, sortOrder },
  });

  revalidatePath("/");
  revalidatePath("/shop");
  revalidatePath("/admin/categories");
  redirect("/admin/categories");
}

export async function deleteCategory(formData: FormData) {
  await requireAdmin();

  const id = formData.get("id") as string;
  await db.category.delete({ where: { id } });

  revalidatePath("/");
  revalidatePath("/shop");
  revalidatePath("/admin/categories");
}

export async function createProduct(formData: FormData) {
  await requireAdmin();

  const name = formData.get("name") as string;
  const description = formData.get("description") as string;
  const price = parseFloat(formData.get("price") as string);
  const weight = (formData.get("weight") as string) || null;
  const origin = (formData.get("origin") as string) || null;
  const image = formData.get("image") as string;
  const categoryId = formData.get("categoryId") as string;
  const featured = formData.get("featured") === "on";
  const inStock = formData.get("inStock") !== "off";
  const stock = parseInt((formData.get("stock") as string) || "100", 10);

  await db.product.create({
    data: {
      name,
      slug: slugify(name),
      description,
      price,
      weight,
      origin,
      image,
      categoryId,
      featured,
      inStock,
      stock,
      images: "[]",
    },
  });

  revalidatePath("/");
  revalidatePath("/shop");
  revalidatePath("/admin/products");
  redirect("/admin/products");
}

export async function updateProduct(formData: FormData) {
  await requireAdmin();

  const id = formData.get("id") as string;
  const name = formData.get("name") as string;
  const description = formData.get("description") as string;
  const price = parseFloat(formData.get("price") as string);
  const weight = (formData.get("weight") as string) || null;
  const origin = (formData.get("origin") as string) || null;
  const image = formData.get("image") as string;
  const categoryId = formData.get("categoryId") as string;
  const featured = formData.get("featured") === "on";
  const inStock = formData.get("inStock") !== "off";
  const stock = parseInt((formData.get("stock") as string) || "100", 10);

  await db.product.update({
    where: { id },
    data: {
      name,
      description,
      price,
      weight,
      origin,
      image,
      categoryId,
      featured,
      inStock,
      stock,
    },
  });

  revalidatePath("/");
  revalidatePath("/shop");
  revalidatePath("/admin/products");
  redirect("/admin/products");
}

export async function deleteProduct(formData: FormData) {
  await requireAdmin();

  const id = formData.get("id") as string;
  await db.product.delete({ where: { id } });

  revalidatePath("/");
  revalidatePath("/shop");
  revalidatePath("/admin/products");
}

export async function updateOrderStatus(formData: FormData) {
  await requireAdmin();

  const id = formData.get("id") as string;
  const status = formData.get("status") as string;

  await db.order.update({
    where: { id },
    data: { status },
  });

  revalidatePath("/admin/orders");
}
