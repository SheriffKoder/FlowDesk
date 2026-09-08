import { redirect } from "next/navigation";

/**
 * Root route — send visitors straight to Customer Health.
 */
export default function HomePage() {
  redirect("/customers/health");
}
