import { PageHeader } from "@/components/PageHeader";
import { BackPill } from "@/components/AuthShell";

export default function TermsPage() {
    return(
        <div className = "dashboard-shell">
            <PageHeader right ={<BackPill href="/profile" />} />
            <div className="info-card">
                <h3 className="info-title">Terms & Conditions</h3>
                <p className="info-body">Terms content goes here.</p>
            </div>
        </div>
    )
}