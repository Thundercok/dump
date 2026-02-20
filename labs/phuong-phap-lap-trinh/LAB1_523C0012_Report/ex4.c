#include <stdio.h>

int main(void) {
  int days, years, weeks, daysLeft;

  printf("\n Nhap so ngay: ");
  scanf("%d", &days);

  years = days / 365;
  weeks = (days % 365) / 7;
  daysLeft = (days % 365) % 7;

    printf("\n%d Ngay la: \n", days);
    printf("Nam: %d\n", years);
    printf("Tuan: %d\n", weeks);
    printf("Ngay: %d\n\n", daysLeft);

  return 0;
}