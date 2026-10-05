import React from "react";
import { describe, it, expect, vi, beforeEach } from "vitest";
import { screen, fireEvent, waitFor } from "@testing-library/react";
import { renderWithProviders } from "@/test-utils";
import { UsersPage } from "./UsersPage";
import * as usersAction from "@/features/users/states/action";

describe("UsersPage", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("should render users list and filter with live search", async () => {
    const mockUsers = [
      {
        id: 1,
        name: "Alice Smith",
        email: "alice@delcom.org",
        photo: "https://example.com/alice.jpg",
        email_verified_at: null,
        created_at: "2024-01-01T00:00:00Z",
        updated_at: "2024-01-01T00:00:00Z",
      },
      {
        id: 2,
        name: "Bob Jones",
        email: "bob@delcom.org",
        photo: null,
        email_verified_at: null,
        created_at: "2024-01-02T00:00:00Z",
        updated_at: "2024-01-02T00:00:00Z",
      },
    ];

    vi.spyOn(usersAction, "asyncSetUsers").mockImplementation(
      () => async (dispatch) => {
        dispatch(usersAction.setUsersActionCreator(mockUsers));
        return { success: true };
      }
    );

    renderWithProviders(<UsersPage />, {
      preloadedState: { users: mockUsers },
    });

    expect(screen.getByText("Alice Smith")).toBeInTheDocument();
    expect(screen.getByText("Bob Jones")).toBeInTheDocument();

    // Filter by name
    const searchInput = screen.getByRole("searchbox");
    fireEvent.change(searchInput, { target: { value: "alice" } });

    expect(screen.getByText("Alice Smith")).toBeInTheDocument();
    expect(screen.queryByText("Bob Jones")).not.toBeInTheDocument();

    // Filter with no match
    fireEvent.change(searchInput, { target: { value: "nonexistent" } });
    expect(screen.getByText("Tidak ada pengguna ditemukan")).toBeInTheDocument();
  });

  it("should render empty state message when there are no registered users", async () => {
    vi.spyOn(usersAction, "asyncSetUsers").mockImplementation(
      () => async () => ({ success: true })
    );

    renderWithProviders(<UsersPage />, {
      preloadedState: { users: [] },
    });

    await waitFor(() => {
      expect(
        screen.getByText("Belum ada pengguna terdaftar")
      ).toBeInTheDocument();
    });
  });
});
