#include <stdio.h>

int main(void) {
  char input;

  printf("Nhap gi do vao day\n");
  scanf("%c", &input);

  int isAlphanumeric = ((input >= 'a' && input <= 'z') ||
                        (input >= 'A' && input <= 'Z') ||
                        (input >= '0' && input <= '9'));

    printf("%s\n", isAlphanumeric ? "la chu hoac so" : "khong phai la chu hoac so");


  return 0;
}