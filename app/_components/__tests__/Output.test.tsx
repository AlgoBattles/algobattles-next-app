import React from "react";
import { render, screen } from "@testing-library/react";
import "@testing-library/jest-dom";
import OutputConsole from "../Output";
import { useBattle } from "../../_contexts/BattleContext";

// Mock the useBattle hook
jest.mock("../../_contexts/BattleContext", () => ({
  useBattle: jest.fn(),
}));

describe("OutputConsole", () => {
  test("renders without crashing when testOutput is null", () => {
    (useBattle as jest.Mock).mockReturnValue({ battle: { testOutput: null } });
    render(<OutputConsole />);
    expect(screen.getByText("Output")).toBeInTheDocument();
    // Assuming output lines are rendered within div elements, check if any are present
    const outputLines = screen
      .queryAllByText(/.+/)
      .filter((element) => element.tagName === "DIV");
    expect(outputLines.length).toBe(0); // Expect no div elements with text content
  });

  test("correctly displays multiple lines from testOutput", () => {
    const testOutput = "Line 1\nLine 2\nLine 3";
    (useBattle as jest.Mock).mockReturnValue({ battle: { testOutput } });
    render(<OutputConsole />);
    expect(screen.getByText("Output")).toBeInTheDocument();
    // Check for each line
    testOutput.split("\n").forEach((line, index) => {
      if (index > 0) {
        // Since the first line isn't supposed to be displayed based on the component logic
        expect(screen.getByText(line)).toBeInTheDocument();
      }
    });
  });

  test("does not display the first line from testOutput", () => {
    const testOutput = "Line 1\nLine 2";
    (useBattle as jest.Mock).mockReturnValue({ battle: { testOutput } });
    render(<OutputConsole />);
    expect(screen.queryByText("Line 1")).not.toBeInTheDocument();
  });
});
