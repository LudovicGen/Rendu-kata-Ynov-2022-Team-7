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

  it("should fake dayTeam for tunnel 28 length and 2 days", () => {
    const test: Team = {
      miners: 3,
      healers: 1,
      smithies: 2,
      lighters: 0,
      innKeepers: 8,
      guards: 0,
      guardManagers: 0,
      washers: 2,
    };

    const estimator = new MockDiggingEstimator([0, 3, 5.5, 7]);
    const result = estimator.tunnel(28, 2, "granite");
    expect(result.dayTeam).toEqual(test);
  });

  it("should fake nightTeam for tunnel 28 length and 2 days", () => {
    const test: Team = {
      miners: 3,
      healers: 1,
      smithies: 2,
      lighters: 4,
      innKeepers: 12,
      guards: 5,
      guardManagers: 2,
      washers: 3,
    };

    const estimator = new MockDiggingEstimator([0, 3, 5.5, 7]);
    const result = estimator.tunnel(28, 2, "granite");
    expect(result.nightTeam).toEqual(test);
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
});
