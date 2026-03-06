
#include <stdio.h>
 
int main(void) {
    int num1, num2, num3;

    printf("Nhap ba so: \n");
    scanf("%d", &num1);
    scanf("%d", &num2);
    scanf("%d", &num3);
    int result = (num1 > num2 && num1 > num3) 
                ? num1 : (num2 > num3) 
                ? num2 : num3;
    printf("So lon nhat la %d", result);
    return 0;
}