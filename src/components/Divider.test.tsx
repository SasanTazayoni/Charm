import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import Divider from "./Divider";

describe("Divider", () => {
  it("renders without crashing", () => {
    const { container } = render(<Divider />);
    expect(container.firstChild).toBeTruthy();
  });

  it("renders the divider lines", () => {
    const { container } = render(<Divider />);
    const lines = container.querySelectorAll(".divider-line");
    expect(lines).toHaveLength(2);
  });
});
