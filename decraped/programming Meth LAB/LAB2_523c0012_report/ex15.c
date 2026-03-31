#include <stdio.h>

int main() {
  int n, i;

  printf("Enter a positive integer: ");
    while (scanf("%d", &n) != 1 || n < 0) {
        printf("Invalid input, please try again: ");
    }

  printf("The prime numbers between 1 and %d are: \n", n);

  for (i = 2; i <= n; i++) {
   
    int is_prime = 1;
    for (int j = 2; j * j <= i; j++) {
      if (i % j == 0) {
        is_prime = 0;
        break;
      }
    }

    if (is_prime) {
      printf("(for)%d ", i);
    }
  }
  printf("\n");

  
  i = 2;

 while (i <= n) {
   
    int is_prime = 1;
    int j = 2;
    while (j * j <= i) {
      if (i % j == 0) {
        is_prime = 0;
        break;
      }
      j++;
    }

   
    if (is_prime) {
      printf("(while)%d ", i);
    }

    i++;
  }

  printf("(while)\n");


  i = 2;
 do {
   
    int is_prime = 1;
    int j = 2;
    while (j * j <= i) {
      if (i % j == 0) {
        is_prime = 0;
        break;
      }
      j++;
    }
    if (is_prime) {
      printf("(do - while)%d ", i);
    }

    i++;
  } while (i <= n);


  return 0;
}