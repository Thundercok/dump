#include <stdio.h>

int main(void) {
  int num1, num2, final1, final2;

  printf("Assign 2 numbers: ");
  scanf("%d %d", &num1, &num2);

  if (num1 < num2) {
    final1 = num1;
    final2 = num2;
  } else {
    final1 = num2;
    final2 = num1;
  }

  num1 = final1;
  num2 = final2;

  // Remove the unused argument `final1` from the `printf()` statement.
  printf("Sorted: num1 = %d, num2 = %d\n", num1, num2);

  return 0;
}