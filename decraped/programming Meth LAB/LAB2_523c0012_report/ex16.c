#include <stdio.h>

int main() {
    int n, i,  digitNum, digitSum;

    printf("Enter a positive integer: ");
        while (scanf("%d", &n) != 1 || n < 0) {
            printf("Invalid input, please try again: ");
        }
  for (i = 1; i <= n; i++) {
    digitNum = 0;
    int temp = i;
    while (temp > 0) {
        temp /= 10;
        digitNum++;
    }

    digitSum = 0;
    temp = i;
    do {
      int digit = temp % 10;
      digitSum += digit * digit * digit;
      temp /= 10;
    } while (temp > 0);

    // If the sum of the digits is equal to the number, then the number is an Armstrong number.
    if (digitSum == i) {
      printf("%d ", i);
    }
  }

  printf("\n");

}