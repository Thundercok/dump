  #include <stdio.h>  
    int main(){
   
    int i, n, sum = 0;
  printf("Enter a positive integer: ");
  while (scanf("%d", &n) != 1 || n < 0) {
  printf("Invalid input, please try again: ");
};

    for (int i = 0; i <= n; i += 2) {
    sum += i;

  };

  printf("(for)The sum of all even numbers between 1 and %d is %d.\n", n, sum);
  sum = 0; 
  i=0;
    while (i  <= n ) {
    sum += i;
    i +=2;
 };

  printf("(while)The sum of all even numbers between 1 and %d is %d.\n", n, sum); 
 sum = 0;
 i =0;
    do
    {
        sum += i;
        i+= 2;
    } while (i <= n);

  printf("(do-while)The sum of all even numbers between 1 and %d is %d.\n", n, sum); 
  return 0;
    }