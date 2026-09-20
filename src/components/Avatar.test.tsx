import { describe, expect, it } from "vitest";
import { render, screen } from "@testing-library/react";
import Avatar from "./Avatar";

describe("Avatar", () => {
  it("renders an image when avatarUrl is provided", () => {
    render(<Avatar avatarUrl="https://example.com/pic.jpg" name="Amy" />);
    const img = screen.getByRole("img", { name: "Amy's avatar" });
    expect(img).toHaveAttribute("src", "https://example.com/pic.jpg");
  });

  it("uses a generic alt text when no name is given but an avatar is", () => {
    render(<Avatar avatarUrl="https://example.com/pic.jpg" />);
    expect(screen.getByRole("img", { name: "Avatar" })).toBeInTheDocument();
  });

  it("falls back to the first initial of the name, uppercased, when there's no avatar", () => {
    render(<Avatar name="amy" />);
    expect(screen.getByText("A")).toBeInTheDocument();
  });

  it("falls back to '?' when there's no avatar and no name", () => {
    render(<Avatar />);
    expect(screen.getByText("?")).toBeInTheDocument();
  });

  it("falls back to '?' when the name is only whitespace", () => {
    render(<Avatar name="   " />);
    expect(screen.getByText("?")).toBeInTheDocument();
  });

  it("sizes the avatar based on the size prop", () => {
    render(<Avatar name="Amy" size={50} />);
    const fallback = screen.getByText("A");
    expect(fallback).toHaveStyle({ width: "50px", height: "50px" });
  });
});
