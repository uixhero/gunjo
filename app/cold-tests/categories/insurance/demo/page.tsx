import { redirect } from "next/navigation";
import { DEMO_SCREENS } from "./_lib/fictional";

// デモの入口は最初の画面（契約管理）へ直行する。扉ページのカードが
// /demo を指すので、ここで実画面へ送る。
export default function InsuranceDemoIndexPage() {
    redirect(DEMO_SCREENS[0].href);
}
