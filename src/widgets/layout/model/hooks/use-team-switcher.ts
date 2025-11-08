"use client";

import { useState, useCallback, useMemo } from "react";
import type { Team } from "../types";

/**
 * Hook to manage team switcher state
 * 
 * Provides team selection logic and active team management.
 * Includes methods for switching teams by index or team object.
 * 
 * @param teams - Array of available teams
 * @returns Team switcher state and controls
 * 
 * @example
 * ```tsx
 * const { activeTeam, setActiveTeam, switchToNext } = useTeamSwitcher(teams);
 * ```
 */
export function useTeamSwitcher(teams: Team[]) {
  const [activeTeamIndex, setActiveTeamIndex] = useState(0);

  const activeTeam = useMemo(() => {
    return teams[activeTeamIndex] ?? teams[0];
  }, [teams, activeTeamIndex]);

  const setActiveTeam = useCallback(
    (team: Team) => {
      const index = teams.findIndex((t) => t.name === team.name);
      if (index !== -1) {
        setActiveTeamIndex(index);
      }
    },
    [teams]
  );

  const setActiveTeamByIndex = useCallback(
    (index: number) => {
      if (index >= 0 && index < teams.length) {
        setActiveTeamIndex(index);
      }
    },
    [teams.length]
  );

  const switchToNext = useCallback(() => {
    setActiveTeamIndex((prev) => (prev + 1) % teams.length);
  }, [teams.length]);

  const switchToPrevious = useCallback(() => {
    setActiveTeamIndex((prev) => (prev - 1 + teams.length) % teams.length);
  }, [teams.length]);

  return {
    activeTeam,
    activeTeamIndex,
    setActiveTeam,
    setActiveTeamByIndex,
    switchToNext,
    switchToPrevious,
  } as const;
}

