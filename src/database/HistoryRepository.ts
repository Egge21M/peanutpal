import { db, type HistoryEvent, type WalletEventType } from "./db";

export interface PaginatedEvents {
  events: HistoryEvent[];
  total: number;
  page: number;
  pageSize: number;
}

export class HistoryRepository {
  async addEvent(event: Omit<HistoryEvent, "id" | "createdAt"> & { createdAt?: number }) {
    const createdAt = event.createdAt ?? Date.now();
    await db.historyEvents.add({ ...event, createdAt });
  }

  async addPaymentEvent(params: {
    amount: number;
    type: Extract<WalletEventType, "direct-payment" | "remote-payment">;
    mintUrl?: string;
    quoteId?: string;
    metadata?: unknown;
  }) {
    await this.addEvent({
      amount: params.amount,
      type: params.type,
      mintUrl: params.mintUrl,
      quoteId: params.quoteId,
      metadata: params.metadata ? JSON.stringify(params.metadata) : undefined,
    });
  }

  async addWithdrawalEvent(params: { amount: number; mintUrl?: string; metadata?: unknown }) {
    await this.addEvent({
      amount: params.amount,
      type: "withdrawal",
      mintUrl: params.mintUrl,
      metadata: params.metadata ? JSON.stringify(params.metadata) : undefined,
    });
  }

  async getPaginated(page: number, pageSize: number): Promise<PaginatedEvents> {
    const total = await db.historyEvents.count();
    const events = await db.historyEvents
      .orderBy("createdAt")
      .reverse()
      .offset((page - 1) * pageSize)
      .limit(pageSize)
      .toArray();
    return { events, total, page, pageSize };
  }
}

export const historyRepository = new HistoryRepository();
