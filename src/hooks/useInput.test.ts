import { describe, it, expect } from "vitest";
import { renderHook, act } from "@testing-library/react";
import { useInput } from "./useInput";

describe("useInput", () => {
  it("should initialize with default empty string", () => {
    const { result } = renderHook(() => useInput());
    expect(result.current[0]).toBe("");
    expect(result.current.value).toBe("");
  });

  it("should initialize with provided initial value", () => {
    const { result } = renderHook(() => useInput("initial"));
    expect(result.current[0]).toBe("initial");
    expect(result.current.value).toBe("initial");
  });

  it("should update value via ChangeEvent", () => {
    const { result } = renderHook(() => useInput(""));

    act(() => {
      result.current[1]({
        target: { value: "updated text" },
      } as any);
    });

    expect(result.current[0]).toBe("updated text");
    expect(result.current.value).toBe("updated text");
  });

  it("should update value via direct string argument", () => {
    const { result } = renderHook(() => useInput(""));

    act(() => {
      result.current.onChange("direct text");
    });

    expect(result.current.value).toBe("direct text");
  });

  it("should ignore event if neither string nor has target", () => {
    const { result } = renderHook(() => useInput("unchanged"));

    act(() => {
      result.current[1](null as any);
    });

    expect(result.current.value).toBe("unchanged");
  });

  it("should update value directly using setValue", () => {
    const { result } = renderHook(() => useInput("initial"));

    act(() => {
      result.current[2]("set directly");
    });

    expect(result.current.value).toBe("set directly");
  });

  it("should reset value back to initial state using reset()", () => {
    const { result } = renderHook(() => useInput("original"));

    act(() => {
      result.current.onChange("modified");
    });
    expect(result.current.value).toBe("modified");

    act(() => {
      result.current.reset();
    });
    expect(result.current.value).toBe("original");
  });
});
