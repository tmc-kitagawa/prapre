import { render, screen, waitFor } from "@testing-library/react";
import { AllResults } from "./AllResults";
import axios from "axios";

describe("All results", () => {
  it("should display 'all results' in the page", () => {
    render(<AllResults />);

    expect(screen.getByRole("heading", { name: "all results" })).toBeVisible();
  });

  it("should call '/api/presentations'", async () => {
    const spyGet = vi.spyOn(axios, "get").mockResolvedValue({
      status: 200,
    });

    render(<AllResults />);

    await waitFor(() => {
      expect(spyGet).toHaveBeenCalledWith("/api/presentations");
    });
    expect(spyGet.mock.calls[0][0]).toBe("/api/presentations");
  });

  it("should display all presentations results", async () => {
    vi.spyOn(axios, "get").mockResolvedValue({
      status: 200,
      data: [
        {
          id: 0,
          title: "sample",
          startTime: 2000,
          userId: 1,
          scoreEye: 90,
          scoreVolume: 90,
          scoreFiller: 40,
          scoreSpeed: 50,
          scoreTime: 70,
        },
        {
          id: 1,
          title: "sample",
          startTime: 2200,
          userId: 1,
          scoreEye: 90,
          scoreVolume: 90,
          scoreFiller: 40,
          scoreSpeed: 50,
          scoreTime: 70,
        },
        {
          id: 2,
          title: "sample",
          startTime: 5000,
          userId: 1,
          scoreEye: 90,
          scoreVolume: 90,
          scoreFiller: 40,
          scoreSpeed: 50,
          scoreTime: 70,
        },
      ],
    });

    render(<AllResults />)

    expect((await screen.findAllByRole("listitem")).length).toBe(3)
  });
});
