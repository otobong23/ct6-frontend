"use client";

import { useState } from "react";
import { PageHeader } from "@/components/PageHeader";
import { AccountMenu } from "@/components/AccountMenu";
import { BottomNav } from "@/components/BottomNav";
import { ModelCard } from "@/components/ModelCard";
import { StatusOverlay } from "@/components/StatusOverlay";
import { WalletChart } from "@/components/WalletCharts";
import { models, type Model } from "@/lib/models";

type Stage = "idle" | "confirm" | "success" | "fail";

export default function ModelsPage() {
  const [index, setIndex] = useState(0);
  const [stage, setStage] = useState<Stage>("idle");
  const [activeModel, setActiveModel] = useState<Model>(models[0]);

  function handleActivate(model: Model) {
    setActiveModel(model);
    setStage("confirm");
  }

  function handleConfirm() {
    setStage(Math.random() > 0.5 ? "success" : "fail");
  }

  return (
    <div className="dashboard-shell">
      <PageHeader right={<AccountMenu />} />

      <div className="assets-card" style={{ marginTop: 16 }}>
        <WalletChart />
      </div>

      <h2 className="section-title" style={{ marginTop: 16 }}>
        Copy Trading
      </h2>
      <p className="text-muted" style={{ fontSize: 13, marginTop: 4 }}>
        Follow proven trade patterns. Copy their moves. Earn with strategy.
      </p>

      <div className="carousel">
        <div className="carousel-dots">
          {models.map((_, i) => (
            <button
              key={i}
              type="button"
              className={`carousel-dot ${i === index ? "carousel-dot--active" : ""}`}
              onClick={() => setIndex(i)}
            />
          ))}
        </div>
        <div
          className="carousel-track"
          style={{ transform: `translateX(-${index * 100}%)` }}
        >
          {models.map((m) => (
            <div className="carousel-slide" key={m.id}>
              <ModelCard model={m} onActivate={handleActivate} />
            </div>
          ))}
        </div>
      </div>

      {stage === "confirm" && (
        <StatusOverlay
          kind="confirm"
          title="Confirm activation"
          subtitle="You're about to activate the trust trading model"
          confirmRows={[
            { label: "Copy Trade Price:", value: `${activeModel.min}/${activeModel.max}` },
            { label: "Current Profit:", value: activeModel.percent },
            { label: "Duration:", value: activeModel.days },
          ]}
          onContinue={handleConfirm}
          onCancel={() => setStage("idle")}
        />
      )}
      {stage === "success" && (
        <StatusOverlay
          kind="success"
          title="Activated"
          subtitle="You will now received profit daily"
          onContinue={() => setStage("idle")}
        />
      )}
      {stage === "fail" && (
        <StatusOverlay
          kind="fail"
          title="Failed"
          subtitle="You do not have sufficient fund to activate"
          onContinue={() => setStage("idle")}
        />
      )}

      <BottomNav />
    </div>
  );
}