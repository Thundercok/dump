
#include <stdio.h>
 
int main(void) {
    int num1, num2 ;

    printf("Nhap hai so: \n");
    scanf("%d", &num1);
    scanf("%d", &num2);

    int result = (num1 > num2) ? (num1) : (num2);
    printf("So lon nhat la %d", result);
    return 0;
}