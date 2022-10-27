export class TunnelTooLongForDelayException extends Error {
  public message = "Tunnel too long for delay";
}

export class InvalidFormatException extends Error {
  public message = "Invalid format";
}

export class NotWorkingInTestMode extends Error {
  message = "Does not work in test mode";
}

function lengthPerDay(length: number, days: number): number {
  return Math.floor(length / days);
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
  protectors = 0;
}

export class TeamComposition {
  dayTeam: Team = new Team();
  nightTeam: Team = new Team();
  total = 0;

  public getTeamComposition(
    tunnelLength: number,
    tunnelDays: number,
    distancePerDwarf: number[],
    maxDistanceDwarf: number,
    goblinsHere: boolean
  ): TeamComposition {
    const teamCompo = new TeamComposition();
    this.getMiners(
      teamCompo,
      tunnelLength,
      tunnelDays,
      distancePerDwarf,
      maxDistanceDwarf
    );
    this.nightShiftHandlings(teamCompo.nightTeam, goblinsHere);
    this.dayShiftHandlings(teamCompo.dayTeam, goblinsHere);

    teamCompo.total = this.updateTotal(teamCompo);
    return teamCompo;
  }
  private getMiners(
    teamCompo: TeamComposition,
    tunnelLength: number,
    days: number,
    distancePerDwarf: number[],
    MaxDistanceDwarf: number
  ): TeamComposition {
    distancePerDwarf.slice(0, 3).forEach((dig) => {
      if (dig < lengthPerDay(tunnelLength, days)) {
        teamCompo.dayTeam.miners++;
      }
      if (
        lengthPerDay(tunnelLength, days) > MaxDistanceDwarf &&
        dig + MaxDistanceDwarf < lengthPerDay(tunnelLength, days)
      ) {
        teamCompo.nightTeam.miners++;
      }
    });
    return teamCompo;
  }

  private dayShiftHandlings(team: Team, goblinsHere: boolean): Team {
    if (team.miners > 0) {
      ++team.healers;
      ++team.smithies;
      ++team.smithies;

      team.protectors = goblinsHere ? 2 : 0;
      team.innKeepers = this.getInnKeeperCount(team);
      team.washers = this.getWashersCount(team);
    }
    return team;
  }

  private nightShiftHandlings(team: Team, goblinsHere: boolean): Team {
    if (team.miners > 0) {
      ++team.healers;
      ++team.smithies;
      ++team.smithies;
      team.lighters = team.miners + 1;

      this.getProtectorsNight(team, goblinsHere);
      team.innKeepers = this.getInnKeeperCount(team);

      this.getWashersAndGuardAndGuardManager(team);
    }
    return team;
  }
  private updateTotal(team: TeamComposition): number {
    const totalDayTeam = Object.values(team.dayTeam).reduce((t, n) => t + n);
    const totalNightTeam = Object.values(team.nightTeam).reduce(
      (t, n) => t + n
    );
    return totalDayTeam + totalNightTeam;
  }

  private getProtectorsNight(team: Team, goblinsHere: boolean): Team {
    if (goblinsHere) {
      team.protectors = +2;
      team.lighters = team.lighters + team.protectors
    }
    return team;
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

  private getInnKeeperCount(
    team: Omit<Team, "innKeepers" | "guards" | "guardManagers" | "washers">
  ): number {
    return (
      Math.ceil(
        (team.miners + team.healers + team.smithies + team.protectors + (team.lighters || 0)) / 4
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
        team.protectors +
        (team.lighters || 0) +
        (team.guards || 0) +
        (team.guardManagers || 0)) /
        10
    );
  }
}

export class DiggingEstimator {
  public tunnel(
    length: number,
    days: number,
    rockType: string,
    location?: string
  ): TeamComposition {
    const digPerRotation = this.get(rockType);
    const areThereGoblins = this.areThereGoblins(location);
    const maxDigPerRotation = digPerRotation[digPerRotation.length - 1];
    const maxDigPerDay = 2 * maxDigPerRotation;

    if (
      Math.floor(length) !== length ||
      Math.floor(days) !== days ||
      length < 0 ||
      days < 0
    ) {
      throw new InvalidFormatException();
    }

    if (lengthPerDay(length, days) > maxDigPerDay) {
      throw new TunnelTooLongForDelayException();
    }

    const composition = new TeamComposition();
    return composition.getTeamComposition(
      length,
      days,
      digPerRotation,
      maxDigPerRotation,
      areThereGoblins
    );
  }

  protected areThereGoblins(location?: string): boolean {
    const url = `dtp://research.vin.co/are-there-goblins/${location}`;
    console.log(`Tried to fetch ${url}`);
    throw new NotWorkingInTestMode();
  }

  protected get(rockType: string): number[] {
    // For example, for granite it returns [0, 3, 5.5, 7]
    // if you put 0 dwarf, you dig 0m/d/team
    // if you put 1 dwarf, you dig 3m/d/team
    // 2 dwarves = 5.5m/d/team
    // so a day team on 2 miners and a night team of 1 miner dig 8.5m/d
    const url = `dtp://research.vin.co/digging-rate/${rockType}`;
    console.log(`Tried to fetch ${url}`);
    throw new NotWorkingInTestMode();
  }
}
