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
          <Icon icon="codicon:verified-filled" width="20" />
        </span>
      </div>
      <p className="model-percent">{model.percent}</p>
      <div className="model-tags">
        <span className="model-tag">Daily earnings</span>
        <span className="model-tag">{model.days}</span>
      </div>
      <div className="model-range">
        <div className="model-range-item">
          <p className="model-range-label">Min <br />investment <br />amount:</p>
          <p className="model-range-value">{model.min}</p>
        </div>
        <div className="model-range-item">
          <p className="model-range-label">Max <br />investment <br />amount:</p>
          <p className="model-range-value">{model.max}</p>
        </div>
      </div>
      <div className="model-line"></div>
      {model.locked ? (
        <>
          {model.lockedNote && <p className="model-locked-note">{model.lockedNote}</p>}
          <button type="button" className="btn-locked" disabled>
            <Icon icon="fontisto:locked" width="16" />
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