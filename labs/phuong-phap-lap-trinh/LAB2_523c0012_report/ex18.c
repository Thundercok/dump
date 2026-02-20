#include <stdio.h>
  
int main() {
int dec, bin  = 0, pow = 1;

    printf("Enter a decimal number: ");
    scanf("%d", &dec);

        bin += (dec % 2) * pow;
        dec /= 2;
        pow *= 10;

  printf("The binary equivalent of %d is %d\n", dec, bin);
   return 0;
}