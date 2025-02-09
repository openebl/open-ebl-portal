import { env } from "@/env";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import {
  EBlAgreementManifestService,
  flushCache,
} from "./agreement-manifest-service";

// Mock the dependencies
vi.mock("@/env", () => ({
  env: {
    AGREEMENT_MANIFEST_URL: "https://example.com/manifest.json",
  },
}));

describe.sequential("EBlAgreementManifestService", () => {
  beforeEach(() => {
    vi.useFakeTimers();
  });

  afterEach(() => {
    vi.restoreAllMocks();
    vi.useRealTimers();
  });

  it("should fetch and return agreement manifests", async () => {
    flushCache();
    const mockResponse = {
      agreements: [
        {
          service: "bluex_ebl",
          name: "Test1",
          version: 1,
          url: "https://example.com/1",
        },
        {
          service: "bluex_ebl",
          name: "Test2",
          version: 2,
          url: "https://example.com/2",
        },
        {
          service: "other_service",
          name: "Test3",
          version: 3,
          url: "https://example.com/3",
        },
      ],
    };

    global.fetch = vi.fn().mockResolvedValue({
      json: vi.fn().mockResolvedValue(mockResponse),
    });

    const result = await EBlAgreementManifestService.get();

    expect(result).toHaveLength(2);

    const expected = [
      {
        service: "bluex_ebl",
        name: "Test1",
        version: 1,
        url: "https://example.com/1/raw",
      },
      {
        service: "bluex_ebl",
        name: "Test2",
        version: 2,
        url: "https://example.com/2/raw",
      },
    ];
    expect(result[0]).toEqual(expected[0]);
    expect(result[1]).toEqual(expected[1]);
    expect(fetch).toHaveBeenCalledWith(env.AGREEMENT_MANIFEST_URL);
  });

  it("should use cached data if called within an hour", async () => {
    flushCache();
    const mockResponse = {
      agreements: [
        {
          service: "bluex_ebl",
          name: "Test1",
          version: 1,
          url: "https://example.com/1",
        },
      ],
    };

    global.fetch = vi.fn().mockResolvedValue({
      json: vi.fn().mockResolvedValue(mockResponse),
    });

    const result = await EBlAgreementManifestService.get();

    expect(result).toHaveLength(1);

    const expected = {
      service: "bluex_ebl",
      name: "Test1",
      version: 1,
      url: "https://example.com/1/raw",
    };
    expect(result[0]).toEqual(expected);

    vi.advanceTimersByTime(30 * 60 * 1000); // Advance time by 30 minutes

    const result2 = await EBlAgreementManifestService.get();
    expect(result2).toHaveLength(1);

    expect(result2[0]).toEqual(expected);

    expect(global.fetch).toHaveBeenCalledTimes(1);
  });

  it("should fetch new data if cache is older than an hour", async () => {
    flushCache();
    const mockResponse = {
      agreements: [
        {
          service: "bluex_ebl",
          name: "Test1",
          version: 1,
          url: "https://example.com/1",
        },
      ],
    };

    global.fetch = vi.fn().mockResolvedValue({
      json: vi.fn().mockResolvedValue(mockResponse),
    });

    const result = await EBlAgreementManifestService.get();
    expect(result).toHaveLength(1);

    const expected = {
      service: "bluex_ebl",
      name: "Test1",
      version: 1,
      url: "https://example.com/1/raw",
    };
    expect(result[0]).toEqual(expected);

    vi.advanceTimersByTime(61 * 60 * 1000); // Advance time by 61 minutes

    const result2 = await EBlAgreementManifestService.get();
    expect(result2).toHaveLength(1);
    expect(result2[0]).toEqual(expected);

    expect(fetch).toHaveBeenCalledTimes(2);
  });

  it("should return blank list if fetching fails", async () => {
    flushCache();

    global.fetch = vi.fn().mockRejectedValue(new Error("Fetch failed"));

    const result = await EBlAgreementManifestService.get();

    expect(result).toHaveLength(0);
  });

  it("should return blank if validation fails", async () => {
    flushCache();

    const invalidResponse = {
      agreements: [
        {
          service: "bluex_ebl",
          name: "Test1",
          version: "invalid",
          url: "https://example.com/1",
        },
      ],
    };

    global.fetch = vi.fn().mockResolvedValue({
      json: vi.fn().mockResolvedValue(invalidResponse),
    });

    const result = await EBlAgreementManifestService.get();

    expect(result).toHaveLength(0);
  });
});
