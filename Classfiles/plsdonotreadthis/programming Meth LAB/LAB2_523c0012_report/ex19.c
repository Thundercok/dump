#include <stdio.h>

int main() {
  int n, fact = 1;
    printf("Enter a number: ");
  while (scanf("%d", &n) != 1 || n < 0) {
    printf("Invalid input, please try again: ");
  };
  printf("Enter a number: ");

  for(int i=1;i<=n;i++){    
      fact*=i;    
  }    
  printf("%d! equals %d\n", n, fact);

  return 0;
}