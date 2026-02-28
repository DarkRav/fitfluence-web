"use client";

import { AppButton, AppSelect } from "@/shared/ui";
import type { ProgramVersionRecord } from "@/features/programs/types";
import { ru } from "@/localization/ru";
import { StatusBadge } from "@/features/programs/status-badge";

type VersionPickerProps = {
  versions: ProgramVersionRecord[];
  selectedVersionId?: string;
  onChange: (versionId: string) => void;
  onCreate?: () => void;
  isCreating?: boolean;
  disabled?: boolean;
};

function getVersionLabel(version: ProgramVersionRecord): string {
  const statusLabel = ru.common.status[version.status];
  return `v${version.versionNumber} - ${statusLabel}`;
}

export function VersionPicker({
  versions,
  selectedVersionId,
  onChange,
  onCreate,
  isCreating = false,
  disabled = false,
}: VersionPickerProps) {
  const selectedVersion = versions.find((version) => version.id === selectedVersionId);

  return (
    <div className="flex items-center gap-2">
      <div className="w-[260px]">
        <AppSelect
          value={selectedVersionId}
          onValueChange={onChange}
          options={versions.map((version) => ({
            value: version.id,
            label: getVersionLabel(version),
          }))}
          placeholder={ru.programs.versionPicker.selectVersion}
          className={disabled ? "pointer-events-none opacity-60" : undefined}
        />
      </div>
      {selectedVersion ? (
        <div className="inline-flex h-11 items-center gap-2 rounded-xl border border-border bg-sidebar/35 px-3">
          <span className="text-xs text-muted-foreground">
            {ru.programs.versionPicker.currentVersion}: v{selectedVersion.versionNumber}
          </span>
          <StatusBadge status={selectedVersion.status} />
        </div>
      ) : null}
      {onCreate ? (
        <AppButton type="button" variant="secondary" disabled={isCreating} onClick={onCreate}>
          {ru.programs.versionPicker.createVersion}
        </AppButton>
      ) : null}
    </div>
  );
}
