#include <stdio.h>
int main() {
    int num;

    printf("Nhap nam: \n");
    scanf("%d", &num);

    char isLeapYear = (num%4==0) && (num%400==0) || (num%100!=0);

    printf("Nam %d ", num);
    printf("%s\n", isLeapYear ? "la nam nhuan" : "khong phai nam nhuan");

  return 0;
}