#include <stdio.h>

int main(void) {
int num;
    printf("Nhap so vao day:\n");
    scanf("%d", &num);
int isEven = (num % 2 == 0);

    printf("%d", num);
    printf("%s\n", isEven ? "la so chan" : " la so le");
    return 0;

}