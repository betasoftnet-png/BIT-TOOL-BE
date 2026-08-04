/**
 * Utility functions for advanced business calculations.
 * All formulas take a base value and an input parameter, and return the calculated result.
 */

class BusinessLogicUtil {
  static applyGSTInclusive(value, gstRate) {
    // value = original + (original * gstRate/100)
    // original = value / (1 + gstRate/100)
    const original = value / (1 + (gstRate / 100));
    return {
      originalValue: original,
      taxAmount: value - original,
      finalValue: value
    };
  }

  static applyGSTExclusive(value, gstRate) {
    const taxAmount = value * (gstRate / 100);
    return {
      originalValue: value,
      taxAmount: taxAmount,
      finalValue: value + taxAmount
    };
  }

  static applyMarkup(costPrice, markupPercentage) {
    // sellingPrice = costPrice + (costPrice * markupPercentage/100)
    const sellingPrice = costPrice * (1 + (markupPercentage / 100));
    return {
      costPrice,
      markupAmount: sellingPrice - costPrice,
      sellingPrice
    };
  }

  static applyMargin(costPrice, marginPercentage) {
    // margin is based on selling price
    // sellingPrice - (sellingPrice * marginPercentage/100) = costPrice
    // sellingPrice(1 - marginPercentage/100) = costPrice
    // sellingPrice = costPrice / (1 - marginPercentage/100)
    if (marginPercentage >= 100) {
      throw new Error('Margin cannot be 100% or more');
    }
    const sellingPrice = costPrice / (1 - (marginPercentage / 100));
    return {
      costPrice,
      profitAmount: sellingPrice - costPrice,
      sellingPrice
    };
  }

  static applyDiscount(value, discountPercentage) {
    const discountAmount = value * (discountPercentage / 100);
    return {
      originalValue: value,
      discountAmount,
      finalValue: value - discountAmount
    };
  }
}

module.exports = BusinessLogicUtil;
