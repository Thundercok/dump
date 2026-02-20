#include <stdio.h>

int main (void){
    int i, n;
  printf("Enter a number: ");
    while ((scanf("%d", &n) != 1) || n < 0) {
        printf("Invalid input, please try again: ");
}
int sum = 0;
for ( i = 1; i <= n; i++) {
  sum += i;
}
printf("(for)  The  sum of all numbers from 1 to %d is %d\n",n, sum);
  i = 0;
 sum = 0;
while (i <= n) {
  sum +=  i ;
  i++;
}
printf("(while)  The  sum of all numbers from 1 to %d is %d\n",n, sum);
i = 0;
 sum = 0;
do {
  sum +=  i ;
  i++;
}while (i <=n);

printf("(do-while)  The  sum of all numbers from 1 to %d is %d\n",n, sum);
return  0;
}