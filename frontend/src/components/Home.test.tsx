// import { describe, it, vi, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import Home from "./Home";
import { BrowserRouter } from "react-router-dom";
import { MantineProvider } from "@mantine/core";

describe("Home", () => {
  it("should display PraPre & Practice for Presentations", () => {

    renderApp();
    const headerElem = screen.getByRole("heading");
    expect(headerElem).toBeVisible();

    const fullTextOfPraPre = screen.getByText("Practice for Presentations");
    expect(fullTextOfPraPre).toBeVisible();
  });
});

const renderApp = () => {
    const setUserId = vi.fn();
    const slide = new File([], "");
    const setSlide = vi.fn();
    const setPresentationTime = vi.fn();
    vi.mock('react-pdf', () => ({
        Document: vi.fn(),
        Page: vi.fn(),
    }))
    render(
      <BrowserRouter>
        <MantineProvider>
          <Home
            setUserId={setUserId}
            slide={slide}
            setSlide={setSlide}
            setPresentationTime={setPresentationTime}
          />
        </MantineProvider>
      </BrowserRouter>
    );
}
