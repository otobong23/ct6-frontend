"use client";

import Link from "next/link";
import { Icon } from "@iconify/react";
import type { Model } from "@/lib/models";

export function ModelCard({
  model,
  onActivate,
  activateHref,
}: {
  model: Model;
  onActivate?: (m: Model) => void;
  activateHref?: string;
}) {
  return (
    <div className="model-card">
      <div className="model-card-top">
        <span className="model-name">{model.name}</span>
        <span className="model-badge">
          <Icon icon="lucide:check" width="14" />
        </span>
      </div>
      <p className="model-percent">{model.percent}</p>
      <div className="model-tags">
        <span className="model-tag">Daily earnings</span>
        <span className="model-tag">{model.days}</span>
      </div>
      <div className="model-range">
        <div>
          <p className="model-range-label">Min investment amount:</p>
          <p className="model-range-value">{model.min}</p>
        </div>
        <div>
          <p className="model-range-label">Max investment amount:</p>
          <p className="model-range-value">{model.max}</p>
        </div>
      </div>
      {model.locked ? (
        <>
          {model.lockedNote && <p className="model-locked-note">{model.lockedNote}</p>}
          <button type="button" className="btn-locked" disabled>
            <Icon icon="lucide:lock" width="14" />
            Locked
          </button>
        </>
      ) : activateHref ? (
        <Link href={activateHref} className="btn-primary btn-link">
          Activate
        </Link>
      ) : (
        <button type="button" className="btn-primary" onClick={() => onActivate?.(model)}>
          Activate
        </button>
      )}
    </div>
  );
}