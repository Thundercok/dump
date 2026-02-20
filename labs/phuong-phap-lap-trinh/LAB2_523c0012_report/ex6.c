#include <stdio.h>

int main (void) {
    int n, digit, digitSum = 0;
    printf("Enter a number: ");
    scanf("%d", &n);

   
    while (n > 0) {
        digit = n % 10;
        digitSum += digit;
        n /= 10;
    }

    printf("The sum of the digits is %d\n",digitSum);
    return 0;
}