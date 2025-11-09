"use client";

import type { User } from "@/shared/api/types/user.types";

interface UserProfileCardProps {
  user: User;
}

/**
 * UserProfileCard Component
 * Displays user profile information
 * Reusable component for SSR user data
 */
export function UserProfileCard({ user }: UserProfileCardProps) {
  return (
    <div className="mt-6 p-6 bg-card rounded-lg border shadow-sm max-w-md w-full">
      <h2 className="text-lg font-medium mb-4">User Profile (SSR)</h2>
      <div className="text-left space-y-3 text-sm">
        <div>
          <span className="font-medium text-muted-foreground">ID:</span>{" "}
          <span className="text-foreground">{user.id || "N/A"}</span>
        </div>
        <div>
          <span className="font-medium text-muted-foreground">Name:</span>{" "}
          <span className="text-foreground">
            {user.first_name} {user.last_name || ""}
          </span>
        </div>
        {user.username && (
          <div>
            <span className="font-medium text-muted-foreground">Username:</span>{" "}
            <span className="text-foreground">@{user.username}</span>
          </div>
        )}
        {user.telegram_id && (
          <div>
            <span className="font-medium text-muted-foreground">Telegram ID:</span>{" "}
            <span className="text-foreground">{user.telegram_id}</span>
          </div>
        )}
        {user.balance !== undefined && (
          <div>
            <span className="font-medium text-muted-foreground">Balance:</span>{" "}
            <span className="text-foreground">{user.balance}</span>
          </div>
        )}
        {user.points !== undefined && (
          <div>
            <span className="font-medium text-muted-foreground">Points:</span>{" "}
            <span className="text-foreground">{user.points}</span>
          </div>
        )}
        {user.is_admin && (
          <div>
            <span className="font-medium text-muted-foreground">Role:</span>{" "}
            <span className="text-foreground font-semibold text-primary">Admin</span>
          </div>
        )}
      </div>
    </div>
  );
}

