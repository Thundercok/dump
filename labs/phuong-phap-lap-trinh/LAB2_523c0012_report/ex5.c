#include <stdio.h>

int main(void) {

  int n, firstDigit, lastDigit;
    printf("Enter a number: ");
    scanf("%d", &n);

  lastDigit = n % 10;

  while (n >= 10) {
    n /= 10;
  }
  firstDigit = n;

  printf("The first digit of %d is %d\n", n, firstDigit);
  printf("The last digit of %d is %d\n", n, lastDigit);

  return 0;
}