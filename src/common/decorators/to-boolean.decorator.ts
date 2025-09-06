import { Transform } from 'class-transformer';

export const ToBoolean = (params?: { includeNegative?: boolean }) =>
  Transform(({ value }) => {
    if (params?.includeNegative) {
      if (value === 'true') return true;
      if (value === 'false') return false;
      return undefined;
    }
    return value === 'true' || undefined;
  });
