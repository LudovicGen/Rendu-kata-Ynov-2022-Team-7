import { DiggingEstimator, TunnelTooLongForDelayException } from "./digging-estimator";

describe("digging estimator", () => {
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

  it("should test TunelTooLongForDelayException", () => {
    const estimator = new MockDiggingEstimator([0, 3, 5.5, 7]);

    expect(() => {
      estimator.tunnel(45, 2, "granite");
    }).toThrowError();
  });
});
