import { PageHeader } from "@/components/PageHeader";
import { BackPill } from "@/components/AuthShell";

export default function NotificationsPage() {
    return(
        <div className = "dashboard-shell">
            <PageHeader right ={<BackPill href="/profile" />} />
            <p className="placeholder-text">No notifications yet.</p>
        </div>
    );
}