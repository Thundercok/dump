#include <stdio.h>

int main (void){
    int a, b;
    printf("Enter a number: ");
    scanf("%d", &a);
    for (b = 1; b <= 10; b++) {
        printf("%d * %d = %d\n",a ,b ,a * b);
    } 
return 0;
}