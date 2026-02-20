#include <stdio.h>

int main(void) {
  float x, y, z;

  printf("Nhap 3 goc de xem chung co the tao nen  mot tam giac khong:\n");
  scanf("%f %f %f", &x, &y, &z);

  int isTriangle = (x > 0) && (y > 0) && (z > 0);

  isTriangle = isTriangle && ((x + y + z) == 180.0f);

  printf("%s\n", isTriangle ? "co the tao thanh tam giac" : "khong the tao thanh tam giac");
  return 0;
}
