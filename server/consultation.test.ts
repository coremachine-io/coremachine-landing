import { describe, expect, it, vi } from "vitest";
import { appRouter } from "./routers";
import type { TrpcContext } from "./_core/context";
import * as db from "./db";
import * as notification from "./_core/notification";

// Mock database and notification functions
vi.mock("./db", () => ({
  createConsultation: vi.fn(),
  trackTemplateDownload: vi.fn(),
}));

vi.mock("./_core/notification", () => ({
  notifyOwner: vi.fn(),
}));

function createMockContext(): TrpcContext {
  return {
    user: null,
    req: {
      protocol: "https",
      headers: {},
    } as TrpcContext["req"],
    res: {} as TrpcContext["res"],
  };
}

describe("consultation.submit", () => {
  it("should successfully submit consultation and notify owner", async () => {
    const ctx = createMockContext();
    const caller = appRouter.createCaller(ctx);

    const mockCreateConsultation = vi.mocked(db.createConsultation);
    const mockNotifyOwner = vi.mocked(notification.notifyOwner);

    mockCreateConsultation.mockResolvedValue(undefined as any);
    mockNotifyOwner.mockResolvedValue(true);

    const result = await caller.consultation.submit({
      name: "張三",
      contact: "+852 1234 5678",
      email: "test@example.com",
      needs: "我想註冊前海公司並申請補貼",
      language: "zh-HK",
    });

    expect(result.success).toBe(true);
    expect(mockCreateConsultation).toHaveBeenCalledWith({
      name: "張三",
      contact: "+852 1234 5678",
      email: "test@example.com",
      needs: "我想註冊前海公司並申請補貼",
      language: "zh-HK",
      status: "pending",
    });
    expect(mockNotifyOwner).toHaveBeenCalled();
  });

  it("should validate required fields", async () => {
    const ctx = createMockContext();
    const caller = appRouter.createCaller(ctx);

    await expect(
      caller.consultation.submit({
        name: "",
        contact: "+852 1234 5678",
        email: "",
        needs: "短需求",
        language: "zh-HK",
      })
    ).rejects.toThrow();
  });
});

describe("template.download", () => {
  it("should track download and return template content", async () => {
    const ctx = createMockContext();
    const caller = appRouter.createCaller(ctx);

    const mockTrackTemplateDownload = vi.mocked(db.trackTemplateDownload);
    mockTrackTemplateDownload.mockResolvedValue(undefined as any);

    const result = await caller.template.download({
      templateType: "subsidy_application",
      language: "zh-HK",
      email: "test@example.com",
      ipAddress: "127.0.0.1",
      userAgent: "Mozilla/5.0",
    });

    expect(result.success).toBe(true);
    expect(result.content).toBeDefined();
    expect(result.filename).toBe("subsidy_application_zh-HK.md");
    expect(mockTrackTemplateDownload).toHaveBeenCalledWith({
      templateType: "subsidy_application",
      language: "zh-HK",
      email: "test@example.com",
      ipAddress: "127.0.0.1",
      userAgent: "Mozilla/5.0",
    });
  });

  it("should support both template types", async () => {
    const ctx = createMockContext();
    const caller = appRouter.createCaller(ctx);

    const mockTrackTemplateDownload = vi.mocked(db.trackTemplateDownload);
    mockTrackTemplateDownload.mockResolvedValue(undefined as any);

    const result1 = await caller.template.download({
      templateType: "subsidy_application",
      language: "zh-CN",
      email: "",
    });

    const result2 = await caller.template.download({
      templateType: "personal_statement",
      language: "zh-CN",
      email: "",
    });

    expect(result1.filename).toBe("subsidy_application_zh-CN.md");
    expect(result2.filename).toBe("personal_statement_zh-CN.md");
  });
});
