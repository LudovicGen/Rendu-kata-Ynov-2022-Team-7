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

      nt.innKeepers = this.getInnKeeperCount(nt);

      this.getWashersAndGuardAndGuardManager(nt);
    }

    if (dt.miners > 0) {
      ++dt.healers;
      ++dt.smithies;
      ++dt.smithies;

      dt.innKeepers = this.getInnKeeperCount(dt);

      dt.washers = this.getWashersCount(dt);
    }

    composition.total = this.updateTotal(composition);
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

  private getWashersAndGuardAndGuardManager(nt: Team): Team {
    const oldWashers = nt.washers;
    const oldGuard = nt.guards;
    const oldChiefGuard = nt.guardManagers;

    while (
      oldWashers === nt.washers &&
      oldGuard === nt.guards &&
      oldChiefGuard === nt.guardManagers
    ) {
      nt.washers = this.getWashersCount(nt);

      nt.guards = this.getGuardCount(nt);

      nt.guardManagers = this.getGuardManagerCount(nt);
    }
    return nt;
  }

  private updateTotal(team: TeamComposition): number {
    const totalDayTeam = Object.values(team.dayTeam).reduce((t, n) => t + n);
    const totalNightTeam = Object.values(team.nightTeam).reduce(
      (t, n) => t + n
    );
    return totalDayTeam + totalNightTeam;
  }

  private getInnKeeperCount(
    team: Omit<Team, "innKeepers" | "guards" | "guardManagers" | "washers">
  ): number {
    return (
      Math.ceil(
        (team.miners + team.healers + team.smithies + (team.lighters || 0)) / 4
      ) * 4
    );
  }

  private getGuardCount(
    team: Omit<Team, "innKeepers" | "guards" | "guardManagers">
  ): number {
    return Math.ceil(
      (team.miners +
        team.healers +
        team.smithies +
        team.lighters +
        team.washers) /
        3
    );
  }

  private getGuardManagerCount(team: Pick<Team, "guards">): number {
    return Math.ceil(team.guards / 3);
  }

  private getWashersCount(team: Omit<Team, "washers">): number {
    return Math.ceil(
      (team.miners +
        team.healers +
        team.smithies +
        team.innKeepers +
        (team.lighters || 0) +
        (team.guards || 0) +
        (team.guardManagers || 0)) /
        10
    );
  }
}
