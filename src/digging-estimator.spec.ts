import { DiggingEstimator, Team } from "./digging-estimator";

const myMock = jest.fn();
class MockDiggingEstimator extends DiggingEstimator {
  returnValue: number[];

  constructor(mockReturnValue: number[]) {
    super();
    this.returnValue = mockReturnValue;
  }

  get(rockType: string): number[] {
    myMock(rockType);
    return this.returnValue;
  }
}
describe("digging estimator", () => {
  it("should dig 3m by day in granite with 1 dwarf", () => {
    const estimator = new MockDiggingEstimator([0, 3, 5.5, 7]);
    const teamComposition = estimator.tunnel(3, 1, "granite");

    expect(teamComposition.dayTeam.miners).toBe(1);
    expect(teamComposition.nightTeam.miners).toBe(0);
  });

  it("should be dig 3m by day in granite with 1 dwarf Return total 9", () => {
    const estimator = new MockDiggingEstimator([0, 3, 5.5, 7]);
    const teamComposition = estimator.tunnel(3, 1, "granite");

    expect(teamComposition.total).toBe(9);
  });

  it("should be dig 7m by day in granite with 3 dwarf", () => {
    const estimator = new MockDiggingEstimator([0, 3, 5.5, 7]);
    const teamComposition = estimator.tunnel(7, 1, "granite");

    expect(teamComposition.dayTeam.miners).toBe(3);
    expect(teamComposition.nightTeam.miners).toBe(0);
  });

  it("should be dig 7m by day in granite with 3 dwarf Return total 9", () => {
    const estimator = new MockDiggingEstimator([0, 3, 5.5, 7]);
    const teamComposition = estimator.tunnel(7, 1, "granite");

    expect(teamComposition.total).toBe(16);
  });

  it("should mock get DiggingEstimator Return Granite", () => {
    const estimator = new MockDiggingEstimator([0, 3, 5.5, 7]);
    estimator.tunnel(28, 2, "granite");
    expect(myMock).toHaveBeenCalledWith("granite");
  });

  it("should be dig 28m in 2days in granite Return total 48 dwarf needed", () => {
    const estimator = new MockDiggingEstimator([0, 3, 5.5, 7]);

    const teamComposition = estimator.tunnel(28, 2, "granite");

    expect(teamComposition.total).toBe(48);
  });

  it("should return correct team composition with 28l and 2days", () => {
    const estimator = new MockDiggingEstimator([0, 3, 5.5, 7]);
    const teamComposition = estimator.tunnel(28, 2, "granite");
    const fakeDayTeam: Team = {
      miners: 3,
      healers: 1,
      smithies: 2,
      lighters: 0,
      innKeepers: 8,
      guards: 0,
      guardManagers: 0,
      washers: 2,
    };
    const fakeNightTeam: Team = {
      miners: 3,
      healers: 1,
      smithies: 2,
      lighters: 4,
      innKeepers: 12,
      guards: 5,
      guardManagers: 2,
      washers: 3,
    };
    expect(teamComposition.dayTeam).toEqual(fakeDayTeam);
    expect(teamComposition.nightTeam).toEqual(fakeNightTeam);
    expect(teamComposition.total).toBe(48);
  });

  it("should have 1 lighter in night team by miners and more 1 for camp", () => {
    const estimator = new MockDiggingEstimator([0, 3, 5.5, 7]);
    const teamComposition = estimator.tunnel(28, 2, "granite");
    expect(teamComposition.nightTeam.lighters).toBe(4);
  });

  it("should haven't lighter in day team by miners", () => {
    const estimator = new MockDiggingEstimator([0, 3, 5.5, 7]);
    const teamComposition = estimator.tunnel(28, 2, "granite");
    expect(teamComposition.dayTeam.lighters).toBe(0);
  });

  it("should need 1 dwarf guard manager for 3 guards by day return 1 guards managers", () => {
    const estimator = new MockDiggingEstimator([0, 3, 5.5, 7]);
    const totalDay = 2;
    const teamComposition = estimator.tunnel(28, totalDay, "granite");

    expect(teamComposition.nightTeam.guardManagers / totalDay).toBe(1);
  });

  it("should need 1 inn keeper for 1 miners return 1 inn keepers", () => {
    const estimator = new MockDiggingEstimator([0, 3, 5.5, 7]);
    const teamComposition = estimator.tunnel(3, 1, "granite");
    const keepJustMiner =
      teamComposition.dayTeam.innKeepers -
      (teamComposition.dayTeam.healers + teamComposition.dayTeam.smithies);

    expect(keepJustMiner).toBe(1);
  });

  it("should need 1 dwarf washers by 10 dwarfs by day return 2 washers", () => {
    const estimator = new MockDiggingEstimator([0, 3, 5.5, 7]);
    const teamComposition = estimator.tunnel(28, 2, "granite");

    expect(
      teamComposition.nightTeam.washers + teamComposition.dayTeam.washers
    ).toBe(5);
  });
});

describe("Day team members for dig tunnel 28m and 2days", () => {
  it("should be 3 miners", () => {
    const estimator = new MockDiggingEstimator([0, 3, 5.5, 7]);
    const teamComposition = estimator.tunnel(28, 2, "granite");
    expect(teamComposition.dayTeam.miners).toBe(3);
  });

  it("should be 1 healer", () => {
    const estimator = new MockDiggingEstimator([0, 3, 5.5, 7]);
    const teamComposition = estimator.tunnel(28, 2, "granite");
    expect(teamComposition.dayTeam.healers).toBe(1);
  });

  it("should be 2 smithies", () => {
    const estimator = new MockDiggingEstimator([0, 3, 5.5, 7]);
    const teamComposition = estimator.tunnel(28, 2, "granite");
    expect(teamComposition.dayTeam.smithies).toBe(2);
  });

  it("should be 0 lighters", () => {
    const estimator = new MockDiggingEstimator([0, 3, 5.5, 7]);
    const teamComposition = estimator.tunnel(28, 2, "granite");
    expect(teamComposition.dayTeam.lighters).toBe(0);
  });

  it("should be 8 inn keepers", () => {
    const estimator = new MockDiggingEstimator([0, 3, 5.5, 7]);
    const teamComposition = estimator.tunnel(28, 2, "granite");
    expect(teamComposition.dayTeam.innKeepers).toBe(8);
  });

  it("should be 0 guards", () => {
    const estimator = new MockDiggingEstimator([0, 3, 5.5, 7]);
    const teamComposition = estimator.tunnel(28, 2, "granite");
    expect(teamComposition.dayTeam.guards).toBe(0);
  });

  it("should be 0 guard managers", () => {
    const estimator = new MockDiggingEstimator([0, 3, 5.5, 7]);
    const teamComposition = estimator.tunnel(28, 2, "granite");
    expect(teamComposition.dayTeam.guardManagers).toBe(0);
  });

  it("should be 2 washers", () => {
    const estimator = new MockDiggingEstimator([0, 3, 5.5, 7]);
    const teamComposition = estimator.tunnel(28, 2, "granite");
    expect(teamComposition.dayTeam.washers).toBe(2);
  });
});

describe("Night team members for dig tunnel 28m and 2days", () => {
  it("should be 3 miners", () => {
    const estimator = new MockDiggingEstimator([0, 3, 5.5, 7]);
    const teamComposition = estimator.tunnel(28, 2, "granite");
    expect(teamComposition.nightTeam.miners).toBe(3);
  });

  it("should be 1 healer", () => {
    const estimator = new MockDiggingEstimator([0, 3, 5.5, 7]);
    const teamComposition = estimator.tunnel(28, 2, "granite");
    expect(teamComposition.nightTeam.healers).toBe(1);
  });

  it("should be 2 smithies", () => {
    const estimator = new MockDiggingEstimator([0, 3, 5.5, 7]);
    const teamComposition = estimator.tunnel(28, 2, "granite");
    expect(teamComposition.nightTeam.smithies).toBe(2);
  });

  it("should be 4 lighters", () => {
    const estimator = new MockDiggingEstimator([0, 3, 5.5, 7]);
    const teamComposition = estimator.tunnel(28, 2, "granite");
    expect(teamComposition.nightTeam.lighters).toBe(4);
  });

  it("should be 12 inn keepers", () => {
    const estimator = new MockDiggingEstimator([0, 3, 5.5, 7]);
    const teamComposition = estimator.tunnel(28, 2, "granite");
    expect(teamComposition.nightTeam.innKeepers).toBe(12);
  });

  it("should be 5 guards", () => {
    const estimator = new MockDiggingEstimator([0, 3, 5.5, 7]);
    const teamComposition = estimator.tunnel(28, 2, "granite");
    expect(teamComposition.nightTeam.guards).toBe(5);
  });

  it("should be 2 guard managers", () => {
    const estimator = new MockDiggingEstimator([0, 3, 5.5, 7]);
    const teamComposition = estimator.tunnel(28, 2, "granite");
    expect(teamComposition.nightTeam.guardManagers).toBe(2);
  });

  it("should be 3 washers", () => {
    const estimator = new MockDiggingEstimator([0, 3, 5.5, 7]);
    const teamComposition = estimator.tunnel(28, 2, "granite");
    expect(teamComposition.nightTeam.washers).toBe(3);
  });
});

describe("Throw Errors", () => {
  it("should throw an error when too long delay exception", () => {
    const estimator = new MockDiggingEstimator([0, 3, 5.5, 7]);

    expect(() => {
      estimator.tunnel(45, 2, "granite");
    }).toThrowError();
  });
  it("should throw an error when the length is a float", () => {
    const estimator = new MockDiggingEstimator([0, 3, 5.5, 7]);
    expect(() => {
      estimator.tunnel(28.5, 2, "granite");
    }).toThrowError();
  });

  it("should throw an error when the days is a float", () => {
    const estimator = new MockDiggingEstimator([0, 3, 5.5, 7]);
    expect(() => {
      estimator.tunnel(28, 2.5, "granite");
    }).toThrowError();
  });

  it("should throw an error when the length is negative", () => {
    const estimator = new MockDiggingEstimator([0, 3, 5.5, 7]);
    expect(() => {
      estimator.tunnel(-28, 2, "granite");
    }).toThrowError();
  });

  it("should throw an error when the days is negative", () => {
    const estimator = new MockDiggingEstimator([0, 3, 5.5, 7]);
    expect(() => {
      estimator.tunnel(28, -2, "granite");
    }).toThrowError();
  });

  it("should throw an error when the get method isn't mocked", () => {
    const estimator = new DiggingEstimator();
    expect(() => {
      estimator.tunnel(28.5, 2, "granite");
    }).toThrowError('Does not work in test mode');
  });
});
