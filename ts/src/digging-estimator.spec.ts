import { DiggingEstimator } from "./digging-estimator";

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
