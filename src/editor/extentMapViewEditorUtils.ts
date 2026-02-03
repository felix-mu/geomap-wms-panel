import { lastGeomapPanelInstance } from "GeomapPanel";

export function parseMapViewExtent(numberArrayString: string): number[] {
    numberArrayString = numberArrayString.trim();
    numberArrayString = numberArrayString.replaceAll(" ", "");
    const coordinates = numberArrayString.split(",");
    
    if (coordinates.length !== 4) {
        throw new Error(`Extent bounding box needs 4 coordinates: ${coordinates}`);
    }

    const extent: number[] = coordinates.map((coor) => {
        const c = parseFloat(coor);
        if (isNaN(c)) {
            throw new Error(`Could not parse extent coordinate as number: ${c}`);
        }
        return c;
    });

    return extent;
}

export function getCurrentMapExtent(): number[] {
    const map = lastGeomapPanelInstance?.map;

    return map!.getView().calculateExtent(map!.getSize()) as number[];
}
