import { Prisma } from 'generated/prisma';

export type FilteredCart = Prisma.CartGetPayload<{
  include: {
    items: {
      omit: {
        cartId: true;
        productVariantId: true;
      };
      include: {
        productVariant: {
          include: {
            product: {
              omit: {
                updatedAt: true;
                createdAt: true;
                active: true;
                categoryId: true;
              };
            };
          };
        };
      };
    };
  };

  omit: {
    userId: true;
    anonymousUserId: true;
    createdAt: true;
    updatedAt: true;
  };
}>;

export type CartProduct =
  FilteredCart['items'][number]['productVariant']['product'];

export type CartItemResponse = Omit<
  FilteredCart['items'][number],
  'productVariant'
> & {
  productVariant: Omit<
    FilteredCart['items'][number]['productVariant'],
    'product'
  >;
  product: CartProduct;
};

export type CartResponse = Omit<FilteredCart, 'items'> & {
  items: CartItemResponse[];
};
