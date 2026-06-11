import { redirect } from "next/navigation";

export default function AuthPatternIndexPage() {
    redirect("/patterns/auth/login");
}
