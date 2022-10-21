import { DiggingEstimator } from "./digging-estimator";

describe("digging estimator", () => {
  const myMock = jest.fn();

  class MockDiggingEstimator extends DiggingEstimator {
    get(rockType: string): number[] {
      myMock(rockType);
      return [0, 3, 5.5, 7];
    }
  }

  it("should mock get DiggingEstimator Return Granite", () => {
    const estimator = new MockDiggingEstimator();
   estimator.tunnel(28, 2, "granite");
    expect(myMock).toHaveBeenCalledWith("granite");
  });

  it("should mock get DiggingEstimator Return 48", () => {
    const estimator = new MockDiggingEstimator();

    const result = estimator.tunnel(28, 2, "granite");

    expect(result.total).toBe(48);
  });
});
