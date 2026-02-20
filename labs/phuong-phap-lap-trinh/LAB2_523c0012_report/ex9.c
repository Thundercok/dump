#include <stdio.h>

int main() {
  int n, swappedNum;
  int firstDigit, lastDigit, d;

  printf("Enter any number: ");
  scanf("%d", &n);

  
  d = 0;
  while (n >= 10) {
    n /= 10;
    d++;
  }

  firstDigit = n;
  lastDigit = n % 10;

  // Calculate the swapped number.
  swappedNum = lastDigit;
  for (int i = 0; i < d; i++) {
    swappedNum *= 10;
  }
  swappedNum += (n % ((int)pow(10,d)));
  swappedNum -= lastDigit;
  swappedNum += firstDigit;

  printf("The number with swapped first and last digits is: %d\n", swappedNum);

  return 0;
}