#include <stdio.h>
int main() {
  int physics, chemistry, biology, mathematics, computer, totalMarks;
  float percentage;
  char grade;

  printf("Nhap diem vat li:\n");
     scanf("%d ", &physics);
  printf("Nhap diem hoa hoc:\n"); 
     scanf("%d", &chemistry);
  printf("Nhap diem sinh hoc:\n");
     scanf("%d" , &biology);
  printf("Nhap diem toan hoc:\n");
     scanf("%d",&mathematics);
  printf("Nhap diem tin hoc:\n");
     scanf("%d",&computer);

  totalMarks = physics + chemistry + biology + mathematics + computer;
  percentage = totalMarks / 500;

  grade = (percentage >= 90) 
   ? 'A' : (percentage >= 80) 
   ? 'B' : (percentage >= 70) 
   ? 'C' : (percentage >= 60) 
   ? 'D' : (percentage >= 50) 
   ? 'E' : 'F';

  printf("Tong diem (phan tram): %.2f%% \n", percentage);
  printf("Tong diem(chu): %c\n", grade);
  return 0;
}