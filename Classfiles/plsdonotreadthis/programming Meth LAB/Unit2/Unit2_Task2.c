#include <stdio.h>
/*EXAMPLE 1*/
int main(void) {
    int num1, num2, num3;
    float avg;
    printf("Enter 3 intergers: ");
    scanf("%d %d %d", &num1, &num2, &num3);
    avg = (num1 + num2 + num3) / 3.0;
    printf("Average = %.2f\n", avg);
    return 0;
}