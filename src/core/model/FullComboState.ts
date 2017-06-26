import ClearRank from "./ClearRank"

export default class FullComboState {
  id: number;
  name: string;

  private static Map = new Map<number, FullComboState>();

  static NONE = new FullComboState({id: 0, name: "-"});
  static FULL_COMBO = new FullComboState({id: 1, name: "FC"});
  static ALL_JUSTICE = new FullComboState({id: 2, name: "AJ"});
  static ALL_JUSTICE_CRITICAL = new FullComboState({id: 3, name: "AJC"});
  
  constructor(params: any) {
    this.id = params.id;
    this.name = params.name;

    FullComboState.Map.set(this.id, this);
  }

  static find(id: number) {
    return FullComboState.Map.get(id);
  }

  static getFullComboState(isFullCombo: boolean, isAllJustice: boolean, score: number) {
    if (score == ClearRank.MAX.border) return FullComboState.ALL_JUSTICE_CRITICAL;
    if (isAllJustice) return FullComboState.ALL_JUSTICE;
    if (isFullCombo) return FullComboState.FULL_COMBO;
    return FullComboState.NONE;
  }

  static get All() {
    return [
            FullComboState.NONE,
            FullComboState.FULL_COMBO,
            FullComboState.ALL_JUSTICE,
            FullComboState.ALL_JUSTICE_CRITICAL,
           ];
  }
}