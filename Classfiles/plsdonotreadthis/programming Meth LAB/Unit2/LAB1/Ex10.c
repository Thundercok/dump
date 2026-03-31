#include <stdio.h>
int main() {
    int n;

    printf("Enter number: ");
    scanf("%d", &n);

    int result = (n % 2 == 0);

    printf("%d\n", result);
}