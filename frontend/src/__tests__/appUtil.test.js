import ValidationError from "../errors/ValidationError";
import { reorder } from "../utils/appUtil";

describe("Test reorder function", () => {
  it("reorders array with 3 elements", () => {
    const input = [1, 3, 2];
    const output = reorder(input, 1, 2);
    const expected = [1, 2, 3];
    expect(output).toEqual(expected);
  });

  it("returns empty array if array is empty", () => {
    const input = [];
    const output = reorder(input, 0, 0);
    const expected = [];
    expect(output).toEqual(expected);
  });

  it("reorder handles invalid parameters", () => {
    const input = [1, 3, 2];
    const startIndex = 4;
    const endIndex = 5;
    expect(() => reorder(input, startIndex, endIndex)).toThrow(ValidationError);
  });
});
