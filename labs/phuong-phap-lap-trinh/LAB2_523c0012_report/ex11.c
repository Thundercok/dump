#include <stdio.h>
int main() {
  int n, rev = 0, rem, og;
    printf("Enter an integer: ");
    scanf("%d", &n);
    og = n;

    while (n != 0) {
        rem = n % 10;
        rev = rev * 10 + rem;
        n /= 10;
    }

    if (og == rev)
        printf("%d is a palindrome.", og);
    else
        printf("%d is not a palindrome.", og);

    return 0;
}