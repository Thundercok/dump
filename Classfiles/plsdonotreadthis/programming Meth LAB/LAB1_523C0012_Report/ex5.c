#include <stdio.h>

int main(void) {
    int celsius, fahrenheit;
        printf("nhap nhiet do (C) vao day \n");
        scanf( "%d", &celsius);

    fahrenheit = celsius + 33.8;
        printf ("%d do C la %d do F \n", celsius, fahrenheit);
    return 0;
};