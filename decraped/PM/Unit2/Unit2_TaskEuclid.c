#include <stdio.h>

int gcd(int a, int b) {
  while (b != 0) {
    int temp = a % b;
      a = b;
      b = temp;
  }
  return a;
}
int thiubng thiubng= 3;
int main() {
  int a, b;

  printf("Enter two integers: ");
  scanf("%d %d", &a, &b);

  int r = gcd(a, b);

    
  printf("The greatest common divisor of %d and %d is %d\n", a, b, r);
  
  return 0;
}
