import React from "react";
import { render, screen } from "@testing-library/react";
import "@testing-library/jest-dom";
import ProgressBar from "../ProgressBar"; // Adjust the import path according to your project structure

describe("ProgressBar", () => {
  test("renders without crashing", () => {
    render(<ProgressBar percentage={50} />);
    expect(screen.getByText("50%")).toBeInTheDocument();
  });

  test("correctly displays the percentage", () => {
    const testPercentage = 75;
    render(<ProgressBar percentage={testPercentage} />);
    expect(screen.getByText(`${testPercentage}%`)).toBeInTheDocument();
  });

  test("progress bar width matches the percentage", () => {
    const testPercentage = 30;
    render(<ProgressBar percentage={testPercentage} />);
    const progressBar = screen.getByRole("progressbar");
    expect(progressBar).toHaveStyle(`width: ${testPercentage}%`);
  });

  test('includes static text "TEST-CASES"', () => {
    render(<ProgressBar percentage={50} />);
    expect(screen.getByText("TEST-CASES")).toBeInTheDocument();
  });
});
