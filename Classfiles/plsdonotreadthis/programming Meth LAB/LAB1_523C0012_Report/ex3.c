#include <stdio.h>

int main(void) {
  int height, width;
  
   printf(" Nhap chieu dai: \n");
      scanf("%d",  &height);
    printf(" Nhap chieu rong: \n");
      scanf("%d",  &width);

   int perimeter = ( width + height ) * 2;
  printf("Chu vi: %d \n",perimeter);
   int radius = width * height ; 
  printf("Dien tich: %d \n",radius); 
}
