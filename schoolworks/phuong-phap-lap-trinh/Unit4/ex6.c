#include <stdio.h>

int main(void) {
    int num;
    int sum = 0;
    printf("Input numbers to sum it: ");
    scanf("%d", &num);
    
    while (num > 0) {
        sum += num % 10;
        num /= 10;
    }
    printf("The sum of digits is %d.\n", sum);
}