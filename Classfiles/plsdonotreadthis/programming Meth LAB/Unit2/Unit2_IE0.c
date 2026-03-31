#include <stdio.h>


int main(void) {
int num ;
printf("Enter a number: ");
scanf("%d", &num);
    if (num > 0)
    {
        printf("Your number is %d", num);
        printf(", and It's positive! \n");
    }else {
        printf("Your number is %d", num);
        printf(",and It's negative! \n");
    return 0;
}};