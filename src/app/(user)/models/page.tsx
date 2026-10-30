// Fetch copy-trading plans from the backend and buy a plan through its purchase endpoint.

"use client";

import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { AccountMenu } from "@/components/AccountMenu";
import { BottomNav } from "@/components/BottomNav";
import { ModelCard } from "@/components/ModelCard";
import { PageHeader } from "@/components/PageHeader";
import { StatusOverlay } from "@/components/StatusOverlay";
import { TextField } from "@/components/TextField";
import { WalletChart } from "@/components/WalletCharts";
import { useAuth } from "@/context/AuthContext";
import { copyTradingApi } from "@/lib/endpoints";
import type { CopyTradingResponse } from "@/lib/types";
import { Carousel, CarouselContent, CarouselItem, type CarouselApi } from "@/components/ui/carousel";

type Stage = "idle" | "confirm" | "success" | "fail";
const money = (amount: number, currency: string) => new Intl.NumberFormat(undefined, { style: "currency", currency, maximumFractionDigits: 2 }).format(amount);

export default function ModelsPage() {
  const { t } = useTranslation();
  const { refreshProfile } = useAuth();
  const [plans, setPlans] = useState<CopyTradingResponse[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [stage, setStage] = useState<Stage>("idle");
  const [activeModel, setActiveModel] = useState<CopyTradingResponse | null>(null);
  const [amount, setAmount] = useState("");
  const [actionError, setActionError] = useState("");
  const [buying, setBuying] = useState(false);
  const [api, setApi] = useState<CarouselApi>();
  const [current, setCurrent] = useState(0);
  const [count, setCount] = useState(0);

  useEffect(() => {
    let cancelled = false;
    copyTradingApi.list()
      .then((response) => { if (!cancelled) setPlans(response); })
      .catch((requestError) => { if (!cancelled) setError(requestError instanceof Error ? requestError.message : t("Could not load copy-trading plans")); })
      .finally(() => { if (!cancelled) setLoading(false); });
    return () => { cancelled = true; };
  }, [t]);

  useEffect(() => {
    if (!api) return;
    const update = () => { setCurrent(api.selectedScrollSnap()); setCount(api.scrollSnapList().length); };
    update();
    api.on("select", update);
    api.on("reInit", update);
    return () => { api.off("select", update); api.off("reInit", update); };
  }, [api]);

  function handleActivate(model: CopyTradingResponse) {
    if (model.locked) return;
    setActiveModel(model);
    setAmount(String(model.minInvestment));
    setActionError("");
    setStage("confirm");
  }

  async function handleConfirm() {
    if (!activeModel) return;
    const amountInvested = Number(amount);
    if (!Number.isFinite(amountInvested) || amountInvested < activeModel.minInvestment || amountInvested > activeModel.maxInvestment) {
      setActionError(t("Investment must be between {{min}} and {{max}}", { min: money(activeModel.minInvestment, activeModel.currency), max: money(activeModel.maxInvestment, activeModel.currency) }));
      return;
    }
    setBuying(true);
    setActionError("");
    try {
      await copyTradingApi.buy(activeModel._id, { amountInvested });
      await refreshProfile().catch(() => {});
      setStage("success");
    } catch (requestError) {
      setActionError(requestError instanceof Error ? requestError.message : t("Could not activate this plan"));
      setStage("fail");
    } finally {
      setBuying(false);
    }
  }

  return (
    <div className="max-w-120 min-h-dvh my-0 mx-auto pt-5 pb-25 relative">
      <div className="px-4">
        <PageHeader right={<AccountMenu />} />
        <div className="assets-card" style={{ marginTop: 16 }}><WalletChart /></div>
        <h2 className="section-title" style={{ marginTop: 16 }}>{t("copy trading")}</h2>
        <p className="text-muted" style={{ fontSize: 13, marginTop: 4 }}>{t("copy trading text")}</p>
        {loading && <p className="text-muted" role="status">{t("Loading...")}</p>}
        {error && <p className="field-error-text" role="alert">{error}</p>}
        {!loading && !error && plans.length === 0 && <p className="text-muted">{t("No copy-trading plans available")}</p>}
        <div className="carousel-dots">
          {Array.from({ length: count }).map((_, index) => (
            <button key={index} type="button" aria-label={t("Go to slide {{number}}", { number: index + 1 })} aria-current={current === index ? "true" : undefined} onClick={() => api?.scrollTo(index)} className={`carousel-dot ${current === index ? "carousel-dot--active" : ""}`} />
          ))}
        </div>
      </div>

      {!loading && plans.length > 0 && <div className="carousel">
        <Carousel opts={{ loop: true, align: "center" }} className="w-full" setApi={setApi}>
          <CarouselContent>
            {plans.map((plan) => (
              <CarouselItem className="basis-[85%] pl-5" key={plan._id}>
                <ModelCard
                  model={{ id: plan._id, name: plan.traderName, percent: `+${plan.dailyAveragePercentage}%`, days: plan.duration, min: money(plan.minInvestment, plan.currency), max: money(plan.maxInvestment, plan.currency), locked: plan.locked ?? false, lockedNote: plan.lockedNote }}
                  onActivate={() => handleActivate(plan)}
                />
              </CarouselItem>
            ))}
          </CarouselContent>
        </Carousel>
      </div>}

      {stage === "confirm" && activeModel && <StatusOverlay
        kind="confirm"
        title={t("Confirm activation")}
        subtitle={t("You're about to activate the trust trading model")}
        confirmRows={[
          { label: t("Investment range"), value: `${money(activeModel.minInvestment, activeModel.currency)} – ${money(activeModel.maxInvestment, activeModel.currency)}` },
          { label: t("Daily earnings"), value: `${activeModel.dailyAveragePercentage}%` },
          { label: t("Duration:"), value: activeModel.duration },
        ]}
        onContinue={handleConfirm}
        onCancel={() => setStage("idle")}
      >
        <div className="overlay-rows">
          <label htmlFor="investment-amount" className="field-label">{t("Investment amount")}</label>
          <TextField id="investment-amount" type="number" min={activeModel.minInvestment} max={activeModel.maxInvestment} step="0.01" value={amount} onChange={(event) => setAmount(event.target.value)} />
          {actionError && <p className="field-error-text" role="alert">{actionError}</p>}
        </div>
      </StatusOverlay>}
      {stage === "success" && <StatusOverlay kind="success" title={t("Activated")} subtitle={t("Your copy-trade position is active") } onContinue={() => setStage("idle")} />}
      {stage === "fail" && <StatusOverlay kind="fail" title={t("Failed")} subtitle={actionError || t("Could not activate this plan")} onContinue={() => setStage("confirm")} />}
      {buying && <div className="overlay-backdrop" role="status"><div className="overlay-card"><p className="overlay-title">{t("Activating...")}</p></div></div>}
      <BottomNav />
    </div>
  );
}
