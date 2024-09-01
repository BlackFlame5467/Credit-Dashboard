export function formatNumber(num: number) {
  num = Number(num.toFixed(2));
  let [integerPart, fractionalPart] = num.toString().split('.');

  integerPart = integerPart.replace(/\B(?=(\d{3})+(?!\d))/g, ' ');
  const res = fractionalPart ? `${integerPart}.${fractionalPart}` : integerPart;
  return fractionalPart ? `${integerPart}.${fractionalPart}` : integerPart;
}
