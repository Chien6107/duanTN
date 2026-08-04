export const MEMBERSHIP_TIERS = {
  member: {
    key: "member",
    name: "Thành viên",
    icon: "👤",
    minSpent: 0,
    nextTarget: 2000000,
    discountPercent: 0,
    perk: "Tích lũy chi tiêu để lên hạng Bạc"
  },
  silver: {
    key: "silver",
    name: "Bạc",
    icon: "🥈",
    minSpent: 2000000,
    nextTarget: 5000000,
    discountPercent: 3,
    perk: "Giảm 3% mọi đơn hàng"
  },
  gold: {
    key: "gold",
    name: "Vàng",
    icon: "👑",
    minSpent: 5000000,
    nextTarget: 10000000,
    discountPercent: 5,
    perk: "Giảm 5% + Quà sinh nhật"
  },
  diamond: {
    key: "diamond",
    name: "Kim Cương",
    icon: "💎",
    minSpent: 10000000,
    nextTarget: null,
    discountPercent: 8,
    perk: "Giảm 8% + Freeship trọn đời"
  }
};

export const getMembershipTier = (totalSpent = 0) => {
  const spent = Number(totalSpent || 0);
  if (spent >= 10000000) return MEMBERSHIP_TIERS.diamond;
  if (spent >= 5000000) return MEMBERSHIP_TIERS.gold;
  if (spent >= 2000000) return MEMBERSHIP_TIERS.silver;
  return MEMBERSHIP_TIERS.member;
};

export const getCompletedSpending = (orders = [], userId) =>
  orders
    .filter(
      (order) =>
        String(order.userId) === String(userId) &&
        (order.status === "completed" || order.status === "delivered")
    )
    .reduce((total, order) => total + Number(order.total ?? order.totalAmount ?? 0), 0);
