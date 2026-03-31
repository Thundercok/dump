#include <stdio.h>

int main(void) {
    int num;
    int absNum;

    printf("Nhap so vao day\n");
    scanf("%d", &num);

    absNum = (num < 1) ? (-1 * num) : num;

    printf("gia tri tuyet doi cua %d la %d\n", num, absNum);

    return 0;
}