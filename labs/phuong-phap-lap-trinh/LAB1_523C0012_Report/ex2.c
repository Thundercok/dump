#include <stdio.h>

int main(void){

int num1, num2;

    printf("Nhap a \n");
    scanf("%d %d", &num1, &num2);

    printf("Nhap b \n"); 
    scanf("%d %d", &num1, &num2);

             int sum = num1 + num2;
         printf("a + b = %d \n",sum);

                int sub = num1 - num2;
         printf("a - b = %d \n",sub);

                int mul = num1 * num2;
        printf("a * b = %d \n",mul);

                int div = num1 / num2;
        printf("a / b = %d \n",div); 
        
                int mod = num1 % num2;  
        printf("a %% b = %d \n",mod);
     
return 0;
};

