import type { ApiResult } from "@/api/httpClient";
import { searchInfluencerExercises } from "@/api/influencerExercises";
import type { ReferenceOption } from "@/api/referenceData";

const REFERENCE_SCAN_PAGE_SIZE = 50;
const MAX_REFERENCE_SCAN_PAGES = 10;

function mapLabelById(ids: string[], labels: string): Map<string, string> {
  const parts = labels
    .split(",")
    .map((part) => part.trim())
    .filter(Boolean);
  const pairs = new Map<string, string>();

  ids.forEach((id, index) => {
    const label = parts[index];
    if (label) {
      pairs.set(id, label);
    }
  });

  return pairs;
}

async function collectReferenceOptions(
  kind: "muscles" | "equipment",
  search = "",
): Promise<ApiResult<ReferenceOption[]>> {
  const optionsById = new Map<string, ReferenceOption>();
  let page = 0;
  let totalPages = 1;

  while (page < totalPages && page < MAX_REFERENCE_SCAN_PAGES) {
    const result = await searchInfluencerExercises({
      page,
      size: REFERENCE_SCAN_PAGE_SIZE,
    });

    if (!result.ok) {
      return result;
    }

    totalPages = result.data.totalPages;

    result.data.items.forEach((exercise) => {
      const ids = kind === "muscles" ? exercise.muscleIds : exercise.equipmentIds;
      const labels = kind === "muscles" ? exercise.musclesLabel : exercise.equipmentLabel;
      const labelById = mapLabelById(ids, labels);

      ids.forEach((id) => {
        const label = labelById.get(id);
        if (!label || optionsById.has(id)) {
          return;
        }

        optionsById.set(id, {
          id,
          code: id,
          label,
        });
      });
    });

    page += 1;
  }

  const normalizedSearch = search.trim().toLowerCase();
  const options = Array.from(optionsById.values())
    .filter((option) =>
      normalizedSearch ? option.label.toLowerCase().includes(normalizedSearch) : true,
    )
    .sort((first, second) => first.label.localeCompare(second.label, "ru"));

  return {
    ok: true,
    data: options,
  };
}

export function listInfluencerMuscleOptions(search = ""): Promise<ApiResult<ReferenceOption[]>> {
  return collectReferenceOptions("muscles", search);
}

export function listInfluencerEquipmentOptions(search = ""): Promise<ApiResult<ReferenceOption[]>> {
  return collectReferenceOptions("equipment", search);
}
