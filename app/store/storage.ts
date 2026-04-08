/* eslint-disable @typescript-eslint/no-explicit-any */
export function saveSale(sale: any) {
  const sales = JSON.parse(localStorage.getItem('sales') || '[]');
  sales.push(sale);
  localStorage.setItem('sales', JSON.stringify(sales));
}

export function getSales() {
  return JSON.parse(localStorage.getItem('sales') || '[]');
}