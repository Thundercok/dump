#include <stdio.h>

int main (void) {
    int n, count  = 0;
    printf("Enter a number: ");
    scanf("%d", &n);

    while (n > 0) {
        n/=10;
        count++;
    }

    printf("Number of digits %d\n",count);
    return 0;
}