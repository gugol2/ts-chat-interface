import { render } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { LoadingSkeleton } from "./LoadingSkeleton";

describe("LoadingSkeleton", () => {
  it("renders the specified number of skeleton messages", () => {
    const { container } = render(<LoadingSkeleton skeletonCount={10} />);
    const skeletons = container.querySelectorAll(".message-skeleton");
    expect(skeletons.length).toBe(10);
  });

  it("renders 50 skeleton messages when skeletonCount is not passed", () => {
    const { container } = render(<LoadingSkeleton />);
    const skeletons = container.querySelectorAll(".message-skeleton");
    expect(skeletons.length).toBe(50);
  });

  it("renders 1 skeleton message when skeletonCount is 1", () => {
    const { container } = render(<LoadingSkeleton skeletonCount={1} />);
    const skeletons = container.querySelectorAll(".message-skeleton");
    expect(skeletons.length).toBe(1);
  });

  it("renders no skeleton messages when skeletonCount is 0", () => {
    const { container } = render(<LoadingSkeleton skeletonCount={0} />);
    const skeletons = container.querySelectorAll(".message-skeleton");
    expect(skeletons.length).toBe(0);
  });
});
