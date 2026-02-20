#include <stdio.h>
int main(void) {
    int num1, num2, num3, ave;
    printf("Enter 3 values to calculate their average sum: ");
    scanf("%d %d %d", &num1, &num2, &num3 );
    ave = (num1 + num2 + num3) /3;
    printf("Average = %.2d\n", ave);
    return 0;
};
