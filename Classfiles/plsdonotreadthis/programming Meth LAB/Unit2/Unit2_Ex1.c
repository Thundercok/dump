#include  <stdio.h>

int main(void) {
int sum = 0, count = 0, number;
    printf("Input the number that need to mutliply by 5");
  while (count < 5) {
    scanf("%d", &number);
    sum += number;
    count++;
  }
  printf("The sum is: %d\n", sum);
  return 0;
};