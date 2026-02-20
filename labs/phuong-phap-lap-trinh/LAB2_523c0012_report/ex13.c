#include <stdio.h>

int countDigits(int num) {
    int count = 0;
    while (num != 0) {
        num /= 10;
        ++count;
    }
    return count;
}

int power(int base, int exp) {
    int result = 1;
    while (exp != 0) {
        result *= base;
        --exp;
    }
    return result;
}

int main() {
    int num, originalNum, remainder, result = 0, n;

    printf("Enter an integer: ");
    scanf("%d", &num);

    n = countDigits(num);
    originalNum = num;

    while (originalNum != 0) {
        remainder = originalNum%10;
        result += power(remainder, n);
        originalNum /= 10;
    }

    if(result == num)
        printf("%d is an Armstrong number.", num);
    else
        printf("%d is not an Armstrong number.", num);

    return 0;
}
