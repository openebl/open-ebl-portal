export const shippers = ["Foxconn", "Quanta Computer", "Flex", "Pegatron"].map((n) => ({
  name: n,
  value: n,
}));

export const consignees = ["Samsung", "Apple", "Google", "Microsoft"].map(
  (n) => ({ name: n, value: n.toLowerCase() }),
);
