"use client";

import { useState } from "react";
import { Button } from "@/components/Button";

type Props = {
  coverageAcres: number;
  priceZMW: number;
};

export function CoverageCalculator({ coverageAcres, priceZMW }: Props) {
  const [farmSize, setFarmSize] = useState<number>(coverageAcres);

  const units = Math.max(1, Math.ceil(farmSize / coverageAcres));
  const total = units * priceZMW;

  return (
    <div className="grid sm:grid-cols-2 gap-6">
      <div className="rounded-xl border border-green-100 p-5 bg-white">
        <label className="text-sm font-medium text-green-800">
          Your farm size (acres)
        </label>
        <div className="flex items-center gap-3 mt-2">
          <input
            type="number"
            min="0.1"
            step="0.1"
            value={farmSize}
            onChange={(e) => setFarmSize(parseFloat(e.target.value) || 0)}
            className="w-28 px-3 py-2 rounded-lg border border-green-200 text-green-900 font-semibold"
          />
          <span className="text-sm text-gray-500">Each unit covers {coverageAcres} acre(s)</span>
        </div>
      </div>

      <div className="rounded-xl border border-green-100 p-5 bg-green-50/40 flex flex-col justify-center">
        <div className="text-sm text-gray-500">Recommended</div>
        <div className="text-green-900 font-semibold">
          {units} unit{units > 1 ? "s" : ""} · {farmSize} acres
        </div>
        <div className="text-2xl font-bold text-amber-700 mt-1">
          K{total.toLocaleString()}
        </div>
        <p className="text-xs text-gray-500 mt-1">
          Price per acre: K{(priceZMW / coverageAcres).toLocaleString()}
        </p>
      </div>
    </div>
  );
}