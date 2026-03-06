#include <stdio.h>
int main (void) {
    int n;  
    printf("Enter an integer: ");
    while (scanf("%d", &n) != 1 || n < 0) {
        printf("Invalid input, please try again: ");
    }
    for (int i = 2; i <= n/2; i++) { 
        if (n % i == 0) { 
            printf("The number %d is not a Prime Number\n", n); 
        }  
      
    }   
printf("The number %d is a Prime Number\n", n); 
return 0; 
}

