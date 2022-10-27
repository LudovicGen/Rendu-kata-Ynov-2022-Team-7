export class TunnelTooLongForDelayException extends Error {
  public message = "Tunnel too long for delay";
}

export class InvalidFormatException extends Error {
  public message = "Invalid format";
}

export class Team {
  miners = 0;
  healers = 0;
  smithies = 0;
  lighters = 0;
  innKeepers = 0;
  guards = 0;
  guardManagers = 0;
  washers = 0;
}

export class TeamComposition {
  dayTeam: Team = new Team();
  nightTeam: Team = new Team();

  total = 0;
}

export class DiggingEstimator {
  public tunnel(
    length: number,
    days: number,
    rockType: string
  ): TeamComposition {
    const digPerRotation = this.get(rockType);
    const maxDigPerRotation = digPerRotation[digPerRotation.length - 1];
    const maxDigPerDay = 2 * maxDigPerRotation;
    const composition = new TeamComposition();
    const lengthPerDay = Math.floor(length / days);
    const dt = composition.dayTeam;
    const nt = composition.nightTeam;

    if (
      Math.floor(length) !== length ||
      Math.floor(days) !== days ||
      length < 0 ||
      days < 0
    ) {
      throw new InvalidFormatException();
    }

    if (lengthPerDay > maxDigPerDay) {
      throw new TunnelTooLongForDelayException();
    }

    // Miners
    digPerRotation.slice(0, 3).forEach((dig) => {
      if (dig < lengthPerDay) {
        composition.dayTeam.miners++;
      }
      if (
        lengthPerDay > maxDigPerRotation &&
        dig + maxDigPerRotation < lengthPerDay
      ) {
        composition.nightTeam.miners++;
      }
    });

    if (nt.miners > 0) {
      ++nt.healers;
      ++nt.smithies;
      ++nt.smithies;
      nt.lighters = nt.miners + 1;

      nt.innKeepers = this.getInnKeeperCount(
        nt.miners,
        nt.healers,
        nt.smithies,
        nt.lighters
      );
    }

    if (dt.miners > 0) {
      ++dt.healers;
      ++dt.smithies;
      ++dt.smithies;

      dt.innKeepers = this.getInnKeeperCount(
        dt.miners,
        dt.healers,
        dt.smithies,
        dt.lighters
      );

      dt.washers = this.getWashersCount(
        dt.miners,
        dt.healers,
        dt.smithies,
        dt.innKeepers
      );
    }

    // eslint-disable-next-line no-constant-condition
    while (true) {
      const oldWashers = nt.washers;
      const oldGuard = nt.guards;
      const oldChiefGuard = nt.guardManagers;

      nt.washers = this.getWashersCount(
        nt.miners,
        nt.healers,
        nt.smithies,
        nt.innKeepers,
        nt.lighters,
        nt.guards,
        nt.guardManagers
      );

      nt.guards = this.getGuardCount(
        nt.miners,
        nt.healers,
        nt.smithies,
        nt.lighters,
        nt.washers
      );

      nt.guardManagers = this.getGuardManagerCount(nt.guards);

      if (
        oldWashers === nt.washers &&
        oldGuard === nt.guards &&
        oldChiefGuard === nt.guardManagers
      ) {
        break;
      }
    }

    composition.total =
      dt.miners +
      dt.washers +
      dt.healers +
      dt.smithies +
      dt.innKeepers +
      nt.miners +
      nt.washers +
      nt.healers +
      nt.smithies +
      nt.innKeepers +
      nt.guards +
      nt.guardManagers +
      nt.lighters;
    return composition;
  }

  protected get(rockType: string): number[] {
    // For example, for granite it returns [0, 3, 5.5, 7]
    // if you put 0 dwarf, you dig 0m/d/team
    // if you put 1 dwarf, you dig 3m/d/team
    // 2 dwarves = 5.5m/d/team
    // so a day team on 2 miners and a night team of 1 miner dig 8.5m/d
    const url = `dtp://research.vin.co/digging-rate/${rockType}`;
    console.log(`Tried to fetch ${url}`);
    throw new Error("Does not work in test mode");
  }

  private getInnKeeperCount(
    miners: number,
    healers: number,
    smithies: number,
    lighters?: number
  ): number {
    return Math.ceil((miners + healers + smithies + (lighters || 0)) / 4) * 4;
  }

  private getGuardCount(
    miners: number,
    healers: number,
    smithies: number,
    lighters: number,
    washers: number
  ): number {
    return Math.ceil((miners + healers + smithies + lighters + washers) / 3);
  }

  private getGuardManagerCount(guards: number): number {
    return Math.ceil(guards / 3);
  }

  private getWashersCount(
    miners: number,
    healers: number,
    smithies: number,
    innKeepers: number,
    lighters?: number,
    guards?: number,
    guardManagers?: number
  ): number {
    return Math.ceil(
      (miners +
        healers +
        smithies +
        innKeepers +
        (lighters || 0) +
        (guards || 0) +
        (guardManagers || 0)) /
        10
    );
  }
}
