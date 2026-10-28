"use client";

import { useCallback } from "react";
import { useFlagshipPin } from "./useFlagshipPin";

// Renders nothing; attaches the pin behaviour to an existing server-rendered section.
export function FlagshipEffects({ targetId }: { targetId: string }) {
  const getTarget = useCallback(() => document.getElementById(targetId), [targetId]);
  useFlagshipPin(getTarget);
  return null;
}
