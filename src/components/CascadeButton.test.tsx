import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";
import { render, screen, fireEvent, act } from "@testing-library/react";
import CascadeButton from "./CascadeButton";

describe("CascadeButton", () => {
  it("renders children", () => {
    render(<CascadeButton variant="gold">Click me</CascadeButton>);
    expect(screen.getByText("Click me")).toBeTruthy();
  });

  it("renders a button element", () => {
    render(<CascadeButton variant="gold">Click me</CascadeButton>);
    expect(screen.getByRole("button")).toBeTruthy();
  });

  it("applies the cascade-button class", () => {
    const { container } = render(
      <CascadeButton variant="gold">Click me</CascadeButton>,
    );
    expect(container.querySelector(".cascade-button")).toBeTruthy();
  });

  it("forwards an object ref to the button element", () => {
    const ref = { current: null as HTMLButtonElement | null };
    render(
      <CascadeButton ref={ref} variant="gold">
        Click me
      </CascadeButton>,
    );
    expect(ref.current).toBeTruthy();
  });

  it("forwards a callback ref to the button element", () => {
    let captured: HTMLButtonElement | null = null;
    render(
      <CascadeButton
        ref={(el) => {
          captured = el;
        }}
        variant="gold"
      >
        Click me
      </CascadeButton>,
    );
    expect(captured).toBeTruthy();
  });

  it("passes disabled prop to the button", () => {
    render(
      <CascadeButton variant="gold" disabled>
        Click me
      </CascadeButton>,
    );
    expect((screen.getByRole("button") as HTMLButtonElement).disabled).toBe(
      true,
    );
  });

  it("applies additional className", () => {
    const { container } = render(
      <CascadeButton variant="gold" className="my-class">
        Click me
      </CascadeButton>,
    );
    expect(container.querySelector(".my-class")).toBeTruthy();
  });

  describe("cascade effect", () => {
    beforeEach(() => {
      Object.defineProperty(HTMLElement.prototype, "offsetWidth", {
        configurable: true,
        get: () => 100,
      });
      Object.defineProperty(HTMLElement.prototype, "offsetHeight", {
        configurable: true,
        get: () => 30,
      });
    });

    afterEach(() => {
      Object.defineProperty(HTMLElement.prototype, "offsetWidth", {
        configurable: true,
        get: () => 0,
      });
      Object.defineProperty(HTMLElement.prototype, "offsetHeight", {
        configurable: true,
        get: () => 0,
      });
    });

    it("appends squares container after mount", () => {
      const { container } = render(
        <CascadeButton variant="gold">Click</CascadeButton>,
      );
      expect(container.querySelector(".squares-container")).toBeTruthy();
    });

    it("creates correct number of squares (cols=20, rows=6)", () => {
      const { container } = render(
        <CascadeButton variant="gold">Click</CascadeButton>,
      );
      expect(container.querySelectorAll(".cascade-square")).toHaveLength(120);
    });

    it("applies gold color to squares for gold variant", () => {
      const { container } = render(
        <CascadeButton variant="gold">Click</CascadeButton>,
      );
      const square = container.querySelector(".cascade-square") as HTMLElement;
      expect(square.style.backgroundColor).toBe("var(--brand-gold-dark)");
    });

    it("applies pink color to squares for pink-outline variant", () => {
      const { container } = render(
        <CascadeButton variant="pink-outline">Click</CascadeButton>,
      );
      const square = container.querySelector(".cascade-square") as HTMLElement;
      expect(square.style.backgroundColor).toBe("rgba(242, 120, 161, 0.25)");
    });

    it("reveals square at cursor position on mouseenter", () => {
      const { container } = render(
        <CascadeButton variant="gold">Click</CascadeButton>,
      );
      const button = container.querySelector("button")!;
      fireEvent.mouseEnter(button, { clientX: 10, clientY: 10 });
      const squares = container.querySelectorAll(".cascade-square");
      expect((squares[42] as HTMLElement).style.opacity).toBe("0");
    });

    it("does not reveal squares on mouseenter when disabled", () => {
      const { container } = render(
        <CascadeButton variant="gold" disabled>
          Click
        </CascadeButton>,
      );
      const button = container.querySelector("button")!;
      fireEvent.mouseEnter(button, { clientX: 10, clientY: 10 });
      const squares = container.querySelectorAll(".cascade-square");
      const anyRevealed = Array.from(squares).some(
        (s) => (s as HTMLElement).style.opacity === "0",
      );
      expect(anyRevealed).toBe(false);
    });

    it("reveals square at cursor position on mousemove while hovering", () => {
      const { container } = render(
        <CascadeButton variant="gold">Click</CascadeButton>,
      );
      const button = container.querySelector("button")!;
      fireEvent.mouseEnter(button, { clientX: 10, clientY: 10 });
      fireEvent.mouseMove(button, { clientX: 50, clientY: 20 });
      const squares = container.querySelectorAll(".cascade-square");
      expect((squares[90] as HTMLElement).style.opacity).toBe("0");
    });

    it("does not reveal squares on mousemove when not hovering", () => {
      const { container } = render(
        <CascadeButton variant="gold">Click</CascadeButton>,
      );
      const button = container.querySelector("button")!;
      fireEvent.mouseMove(button, { clientX: 50, clientY: 20 });
      const squares = container.querySelectorAll(".cascade-square");
      const anyRevealed = Array.from(squares).some(
        (s) => (s as HTMLElement).style.opacity === "0",
      );
      expect(anyRevealed).toBe(false);
    });

    it("resets revealed squares on mouseleave", () => {
      const { container } = render(
        <CascadeButton variant="gold">Click</CascadeButton>,
      );
      const button = container.querySelector("button")!;
      fireEvent.mouseEnter(button, { clientX: 10, clientY: 10 });
      const squares = container.querySelectorAll(".cascade-square");
      expect((squares[42] as HTMLElement).style.opacity).toBe("0");
      fireEvent.mouseLeave(button);
      expect((squares[42] as HTMLElement).style.opacity).toBe("1");
    });

    it("does not throw on mouseleave when no interval is running", () => {
      const { container } = render(
        <CascadeButton variant="gold">Click</CascadeButton>,
      );
      const button = container.querySelector("button")!;
      expect(() => fireEvent.mouseLeave(button)).not.toThrow();
    });

    it("expands wave to adjacent squares after interval tick", () => {
      vi.useFakeTimers();
      const { container } = render(
        <CascadeButton variant="gold">Click</CascadeButton>,
      );
      const button = container.querySelector("button")!;
      fireEvent.mouseEnter(button, { clientX: 10, clientY: 10 });
      const squares = container.querySelectorAll(".cascade-square");
      const before = Array.from(squares).filter(
        (s) => (s as HTMLElement).style.opacity === "0",
      ).length;
      act(() => {
        vi.advanceTimersByTime(20);
      });
      const after = Array.from(squares).filter(
        (s) => (s as HTMLElement).style.opacity === "0",
      ).length;
      expect(after).toBeGreaterThan(before);
      vi.useRealTimers();
    });

    it("clears interval when all squares are revealed", () => {
      vi.useFakeTimers();
      const { container } = render(
        <CascadeButton variant="gold">Click</CascadeButton>,
      );
      const button = container.querySelector("button")!;
      fireEvent.mouseEnter(button, { clientX: 10, clientY: 10 });
      act(() => {
        vi.advanceTimersByTime(20 * 200);
      });
      const squares = container.querySelectorAll(".cascade-square");
      const revealed = Array.from(squares).filter(
        (s) => (s as HTMLElement).style.opacity === "0",
      ).length;
      expect(revealed).toBe(120);
      vi.useRealTimers();
    });

    it("clears interval on mouseleave and stops wave expansion", () => {
      vi.useFakeTimers();
      const { container } = render(
        <CascadeButton variant="gold">Click</CascadeButton>,
      );
      const button = container.querySelector("button")!;
      fireEvent.mouseEnter(button, { clientX: 10, clientY: 10 });
      fireEvent.mouseLeave(button);
      act(() => {
        vi.advanceTimersByTime(200);
      });
      const squares = container.querySelectorAll(".cascade-square");
      const stillRevealed = Array.from(squares).filter(
        (s) => (s as HTMLElement).style.opacity === "0",
      ).length;
      expect(stillRevealed).toBe(0);
      vi.useRealTimers();
    });

    it("does not re-reveal a square already in the wave", () => {
      const { container } = render(
        <CascadeButton variant="gold">Click</CascadeButton>,
      );
      const button = container.querySelector("button")!;
      fireEvent.mouseEnter(button, { clientX: 10, clientY: 10 });
      fireEvent.mouseMove(button, { clientX: 10, clientY: 10 });
      const squares = container.querySelectorAll(".cascade-square");
      expect((squares[42] as HTMLElement).style.opacity).toBe("0");
    });

    it("removes squares container on unmount", () => {
      const { container, unmount } = render(
        <CascadeButton variant="gold">Click</CascadeButton>,
      );
      expect(container.querySelector(".squares-container")).toBeTruthy();
      unmount();
      expect(container.querySelector(".squares-container")).toBeNull();
    });
  });
});
