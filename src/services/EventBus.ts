export type WalletUpdatedDetail = {
  reason: "payment" | "withdrawal" | "manual";
  amount?: number;
};

class AppEventBus extends EventTarget {
  emitWalletUpdated(detail: WalletUpdatedDetail) {
    this.dispatchEvent(new CustomEvent<WalletUpdatedDetail>("wallet:updated", { detail }));
  }
}

export const appEvents = new AppEventBus();
