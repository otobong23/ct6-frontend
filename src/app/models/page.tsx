import { PageHeader} from "@/components/PageHeader";
import { AccountMenu } from "@/components/AccountMenu";
import { BottomNav } from "@/components/BottomNav";
import { ModelCard } from "@/components/ModelCard";
import { models } from "@/lib/models";

export default function ModelsPage() {
  return (
    <div className="dashboard-shell">
      <PageHeader right={<AccountMenu />} />
      <h2 className="section-title" style={{ marginTop: 16 }}>
        Investment Models
      </h2>
      <div className="model-list">
        {models.map((m) => (
          <ModelCard key={m.id} model={m} activateHref="/ai-trade" />
        ))}
      </div>
      <BottomNav />
    </div>
  );
}