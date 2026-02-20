#include <stdio.h>

int main (void) {
    int n, digit, digitProduct = 1;
    printf("Enter a number: ");
    scanf("%d", &n);

   
    while (n > 0) {
        digit = n % 10;
        digitProduct *= digit;
        n /= 10;
    }

    printf("The Product of the digits is %d\n",digitProduct);
    return 0;
}