#include  <stdio.h>
int main(void) {
int number[5];
int sum = 0;
    printf("Input 5 numbers");
  for (int count = 0; count < 5; count++) {
    scanf("%d", &number[count]);
  }
  for (int count = 0; count < 5; count++) {
    sum += number[count];
  }
  printf("The sum of 5 numbers: %d\n", sum);
  return 0;
}