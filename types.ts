
export interface InventoryRecord {
  month: string;
  year: number;
  itemCode: string;
  itemParent: string;
  itemName: string;
  itemType: string;
  itemGroup: string;
  projection: number;
  soQty: number;
  internalQty: number;
  dispatch: number;
  projMinusSo: number;
  fillRate: number;
  soVsProj: number;
  soVsProjPercentage: string;
}

export interface FilterState {
  month: string[];
  year: string[];
  itemGroup: string[];
  itemType: string[];
  itemParent: string[];
}
