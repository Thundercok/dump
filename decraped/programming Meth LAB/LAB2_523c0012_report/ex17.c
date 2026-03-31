#include <stdio.h>

int main() {
  int n, i, sum_of_divisors;

   printf("Enter a positive integer: ");
        while (scanf("%d", &n) != 1 || n < 0) {
            printf("Invalid input, please try again: ");
        }

  printf("The perfect numbers between 1 and %d are: \n", n);

  // Iterate from 1 to n, checking if each number is a perfect number.
  for (i = 1; i <= n; i++) {
    // Calculate the sum of the divisors of the number.
    sum_of_divisors = 0;
    for (int j = 1; j < i; j++) {
      if (i % j == 0) {
        sum_of_divisors += j;
      }
    }

    // If the sum of the divisors is equal to the number, then the number is a perfect number.
    if (sum_of_divisors == i) {
      printf("%d ", i);
    }
  }

  printf("(for)\n");

   i = 1;
   sum_of_divisors = 0;
while (i <= n) {
  
    sum_of_divisors = 0;
    int j = 1;
    while (j < i) {
      if (i % j == 0) {
        sum_of_divisors += j;
      }
      j++;
    }

    
    if (sum_of_divisors == i) {
      printf("(while)%d ", i);
    }

    i++;
  }

  printf("\n");
   i = 1;
   sum_of_divisors = 0;
 do {
  
    sum_of_divisors = 0;
    int j = 1;
    while (j < i) {
      if (i % j == 0) {
        sum_of_divisors += j;
      }
      j++;
    }

    
    if (sum_of_divisors == i) {
      printf("(do -  while)%d ", i);
    }

    i++;
 }while (i <= n);
  return 0;
}