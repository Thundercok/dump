#include <stdio.h>

void first_and_last_digits(int num) {
    int first_digit = num;
    while (first_digit >= 10) {
        first_digit /= 10;
    }
    int last_digit = num % 10;
    printf("The first digit of %d is %d and the last digit is %d.\n", num, first_digit, last_digit);
}

// Example usage
int main() {
    int num = 12345;
    first_and_last_digits(num);
    return 0;
}
