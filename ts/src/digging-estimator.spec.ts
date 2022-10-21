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
  it("should mock get DiggingEstimator Return Granite", () => {
    const estimator = new MockDiggingEstimator([0, 3, 5.5, 7]);
    estimator.tunnel(28, 2, "granite");
    expect(myMock).toHaveBeenCalledWith("granite");
  });

  it("should mock get DiggingEstimator Return 48", () => {
    const estimator = new MockDiggingEstimator([0, 3, 5.5, 7]);

    const result = estimator.tunnel(28, 2, "granite");

    expect(result.total).toBe(48);
  });

  it('should return correct team composition with 28l and 2days', () => {
    const estimator = new MockDiggingEstimator([0, 3, 5.5, 7]);
    const result = estimator.tunnel(28, 2, 'granite');
    const fakeDayTeam: Team = {
      miners: 3,
      healers: 1,
      smithies: 2,
      lighters: 0,
      innKeepers: 8,
      guards: 0,
      guardManagers: 0,
      washers: 2
    } 
    const fakeNightTeam: Team = {
      miners: 3,
      healers: 1,
      smithies: 2,
      lighters: 4,
      innKeepers: 12,
      guards: 5,
      guardManagers: 2,
      washers: 3
    }
    expect(result.dayTeam).toEqual(fakeDayTeam);
    expect(result.nightTeam).toEqual(fakeNightTeam);
    expect(result.total).toBe(48);
  })
});

describe("Day team members", () => {
  it("should be 3 miners", () => {
    const estimator = new MockDiggingEstimator([0, 3, 5.5, 7]);
    const result = estimator.tunnel(28, 2, "granite");
    expect(result.dayTeam.miners).toBe(3);
  });

  it("should be 1 healer", () => {
    const estimator = new MockDiggingEstimator([0, 3, 5.5, 7]);
    const result = estimator.tunnel(28, 2, "granite");
    expect(result.dayTeam.healers).toBe(1);
  });

  it("should be 2 smithies", () => {
    const estimator = new MockDiggingEstimator([0, 3, 5.5, 7]);
    const result = estimator.tunnel(28, 2, "granite");
    expect(result.dayTeam.smithies).toBe(2);
  });

  it("should be 0 lighters", () => {
    const estimator = new MockDiggingEstimator([0, 3, 5.5, 7]);
    const result = estimator.tunnel(28, 2, "granite");
    expect(result.dayTeam.lighters).toBe(0);
  });

  it("should be 8 inn keepers", () => {
    const estimator = new MockDiggingEstimator([0, 3, 5.5, 7]);
    const result = estimator.tunnel(28, 2, "granite");
    expect(result.dayTeam.innKeepers).toBe(8);
  });

  it("should be 0 guards", () => {
    const estimator = new MockDiggingEstimator([0, 3, 5.5, 7]);
    const result = estimator.tunnel(28, 2, "granite");
    expect(result.dayTeam.guards).toBe(0);
  });

  it("should be 0 guard managers", () => {
    const estimator = new MockDiggingEstimator([0, 3, 5.5, 7]);
    const result = estimator.tunnel(28, 2, "granite");
    expect(result.dayTeam.guardManagers).toBe(0);
  });

  it("should be 2 washers", () => {
    const estimator = new MockDiggingEstimator([0, 3, 5.5, 7]);
    const result = estimator.tunnel(28, 2, "granite");
    expect(result.dayTeam.washers).toBe(2);
  });
});

describe("Night team members", () => {
  it("should be 3 miners", () => {
    const estimator = new MockDiggingEstimator([0, 3, 5.5, 7]);
    const result = estimator.tunnel(28, 2, "granite");
    expect(result.nightTeam.miners).toBe(3);
  });

  it("should be 1 healer", () => {
    const estimator = new MockDiggingEstimator([0, 3, 5.5, 7]);
    const result = estimator.tunnel(28, 2, "granite");
    expect(result.nightTeam.healers).toBe(1);
  });

  it("should be 2 smithies", () => {
    const estimator = new MockDiggingEstimator([0, 3, 5.5, 7]);
    const result = estimator.tunnel(28, 2, "granite");
    expect(result.nightTeam.smithies).toBe(2);
  });

  it("should be 4 lighters", () => {
    const estimator = new MockDiggingEstimator([0, 3, 5.5, 7]);
    const result = estimator.tunnel(28, 2, "granite");
    expect(result.nightTeam.lighters).toBe(4);
  });

  it("should be 12 inn keepers", () => {
    const estimator = new MockDiggingEstimator([0, 3, 5.5, 7]);
    const result = estimator.tunnel(28, 2, "granite");
    expect(result.nightTeam.innKeepers).toBe(12);
  });

  it("should be 5 guards", () => {
    const estimator = new MockDiggingEstimator([0, 3, 5.5, 7]);
    const result = estimator.tunnel(28, 2, "granite");
    expect(result.nightTeam.guards).toBe(5);
  });

  it("should be 2 guard managers", () => {
    const estimator = new MockDiggingEstimator([0, 3, 5.5, 7]);
    const result = estimator.tunnel(28, 2, "granite");
    expect(result.nightTeam.guardManagers).toBe(2);
  });

  it("should be 3 washers", () => {
    const estimator = new MockDiggingEstimator([0, 3, 5.5, 7]);
    const result = estimator.tunnel(28, 2, "granite");
    expect(result.nightTeam.washers).toBe(3);
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
    }).toThrowError();
  });
});
