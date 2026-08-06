import { LocationReferenceType } from "@prisma/client";
import { prisma } from "../config/prisma";
import { locationRepository } from "../repositories/location.repository";

interface MapMarker {
  id: number;
  type: LocationReferenceType;
  referenceId: number;
  name: string;
  description: string;
  thumbnail: string | null;
  latitude: number;
  longitude: number;
}

export const mapService = {
  async listMarkers(): Promise<MapMarker[]> {
    const locations = await locationRepository.listAll();

    const orgIds = locations.filter((l) => l.referenceType === "ORGANIZATION").map((l) => l.referenceId);
    const umkmIds = locations.filter((l) => l.referenceType === "UMKM").map((l) => l.referenceId);
    const schoolIds = locations.filter((l) => l.referenceType === "SCHOOL").map((l) => l.referenceId);

    const [orgs, umkms, schools] = await Promise.all([
      orgIds.length ? prisma.organization.findMany({ where: { id: { in: orgIds } } }) : [],
      umkmIds.length ? prisma.umkm.findMany({ where: { id: { in: umkmIds } } }) : [],
      schoolIds.length ? prisma.school.findMany({ where: { id: { in: schoolIds } } }) : [],
    ]);

    const orgMap = new Map(orgs.map((o) => [o.id, o]));
    const umkmMap = new Map(umkms.map((u) => [u.id, u]));
    const schoolMap = new Map(schools.map((s) => [s.id, s]));

    const markers: MapMarker[] = [];

    for (const loc of locations) {
      let name: string | undefined;
      let description = "";
      let thumbnail: string | null = null;

      if (loc.referenceType === "ORGANIZATION") {
        const entity = orgMap.get(loc.referenceId);
        if (!entity) continue;
        name = entity.name;
        description = entity.description;
        thumbnail = entity.thumbnail;
      } else if (loc.referenceType === "UMKM") {
        const entity = umkmMap.get(loc.referenceId);
        if (!entity) continue;
        name = entity.name;
        description = entity.description;
        thumbnail = entity.thumbnail;
      } else {
        const entity = schoolMap.get(loc.referenceId);
        if (!entity) continue;
        name = entity.name;
        description = entity.description;
        thumbnail = entity.thumbnail;
      }

      markers.push({
        id: loc.id,
        type: loc.referenceType,
        referenceId: loc.referenceId,
        name,
        description,
        thumbnail,
        latitude: Number(loc.latitude),
        longitude: Number(loc.longitude),
      });
    }

    return markers;
  },
};
