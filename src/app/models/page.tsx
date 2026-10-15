"use client";

import { useEffect, useState } from "react";
import { PageHeader } from "@/components/PageHeader";
import { AccountMenu } from "@/components/AccountMenu";
import { BottomNav } from "@/components/BottomNav";
import { ModelCard } from "@/components/ModelCard";
import { StatusOverlay } from "@/components/StatusOverlay";
import { WalletChart } from "@/components/WalletCharts";
import { models, type Model } from "@/lib/models";
import { Carousel, CarouselContent, CarouselItem, type CarouselApi } from "@/components/ui/carousel";

type Stage = "idle" | "confirm" | "success" | "fail";

export default function ModelsPage() {
  const [stage, setStage] = useState<Stage>("idle");
  const [activeModel, setActiveModel] = useState<Model>(models[0]);
  const [api, setApi] = useState<CarouselApi>();
  const [current, setCurrent] = useState(0);
  const [count, setCount] = useState(0);

  function handleActivate(model: Model) {
    setActiveModel(model);
    setStage("confirm");
  }

  function handleConfirm() {
    setStage(Math.random() > 0.5 ? "success" : "fail");
  }

  useEffect(() => {
    if (!api) return;

    const update = () => {
      setCurrent(api.selectedScrollSnap());
      setCount(api.scrollSnapList().length);
    };

    update();

    api.on("select", update);
    api.on("reInit", update);

    return () => {
      api.off("select", update);
      api.off("reInit", update);
    };
  }, [api]);

  return (
    <div className="max-w-120 min-h-dvh my-0 mx-auto pt-5 pb-25 relative">
      <div className="px-4">
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

        {/* Carousel Dot buttons */}
        <div className="carousel-dots">
          {Array.from({ length: count }).map((_, index) => (
            <button
              key={index}
              type="button"
              aria-label={`Go to slide ${index + 1}`}
              aria-current={current === index ? "true" : undefined}
              onClick={() => api?.scrollTo(index)}
              className={`carousel-dot ${current === index ? "carousel-dot--active" : ""}`}
            />
          ))}
        </div>
      </div>

      <div className="carousel">
        <Carousel opts={{ loop: true, align: "center" }} className="w-full" setApi={setApi}>
          <CarouselContent>
            {models.map((m) => (
              <CarouselItem className="basis-[85%] pl-5" key={m.id}>
                <ModelCard model={m} onActivate={handleActivate} />
              </CarouselItem>
            ))}
          </CarouselContent>
        </Carousel>
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