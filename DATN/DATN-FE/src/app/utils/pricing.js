const toPositiveNumber = (value) => {
  const number = Number(value);
  return Number.isFinite(number) && number > 0 ? number : 0;
};

export const getProductPricing = (product, priceOverride) => {
  const candidateOriginalPrice = toPositiveNumber(product?.originalPrice);
  const hasTimedFlashSale = Boolean(product?.flashSaleStartAt && product?.flashSaleEndAt);
  const now = Date.now();
  const flashActive = hasTimedFlashSale
    && new Date(product.flashSaleStartAt).getTime() <= now
    && new Date(product.flashSaleEndAt).getTime() > now;
  const price = hasTimedFlashSale
    ? (flashActive ? toPositiveNumber(product?.price) : candidateOriginalPrice)
    : toPositiveNumber(priceOverride ?? product?.price);
  const hasDiscount = price > 0 && candidateOriginalPrice > price;
  const originalPrice = hasDiscount ? candidateOriginalPrice : null;
  const discountPercent = hasDiscount
    ? Math.round(((originalPrice - price) / originalPrice) * 100)
    : 0;

  return { price, originalPrice, hasDiscount, discountPercent, flashActive };
};

export const hasValidProductDiscount = (product, priceOverride) =>
  getProductPricing(product, priceOverride).hasDiscount;

export const isFlashSaleActive = (config, now = Date.now()) => {
  if (!config || config.active === false || config.enabled === false) return false;
  if (!config.endTime) return true;

  const endTime = typeof config.endTime === "number"
    ? config.endTime
    : new Date(config.endTime).getTime();

  return Number.isFinite(endTime) && endTime > now;
};

export const isFlashSaleProduct = (product, config, now = Date.now()) => {
  if (!product || !isFlashSaleActive(config, now)) return false;
  const productIds = Array.isArray(config.productIds) ? config.productIds : [];
  return productIds.some((id) => String(id) === String(product.id));
};

export const getFlashSalePricing = (product, config, now = Date.now()) => {
  if (!isFlashSaleProduct(product, config, now)) return getProductPricing(product);
  const percent = Math.min(99, Math.max(1, Number(config?.discountPercent) || 30));
  const currentPrice = toPositiveNumber(product?.price);
  const storedOriginalPrice = toPositiveNumber(product?.originalPrice);
  const originalPrice = storedOriginalPrice > currentPrice ? storedOriginalPrice : currentPrice;
  const price = Math.round(originalPrice * (1 - percent / 100));
  return {
    price,
    originalPrice,
    hasDiscount: price < originalPrice,
    discountPercent: percent,
    flashActive: true,
  };
};
