#include <stdio.h>

int main() {
    int i, n, sum = 0;

    printf("Enter a positive integer: ");
    scanf("%d", &n);

    for(i = 1; i <= n; i++) {
        if (i % 2 != 0)
            sum = sum + i;
    }
    int i = 1, n, sum = 0;

    printf("Enter a positive integer: ");
    scanf("%d", &n);

    while (i <= n) {
        if (i % 2 != 0)
            sum += i;
        i++;
        #include <stdio.h>


    int i = 1, n, sum = 0;

    printf("Enter a positive integer: ");
    scanf("%d", &n);

    do {
        if (i % 2 != 0)
            sum += i;
        i++;
    } while (i <= n);

    printf("Sum of odd numbers from 1 to %d is %d\n", n, sum);

    return 0;
}


    printf("Sum of odd numbers from 1 to %d is %d\n", n, sum);

    return 0;
}