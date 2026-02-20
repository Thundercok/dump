#include <stdio.h>
int main(void) {
    int n, count, ans;
    count = 1;
    ans = 0;
    printf("Input n: ");
    scanf("%d", &n);
    while (count <= n) {
        ans = ans + count;
        count ++;
    }
    printf ("Sum: %d\n", ans);
    return 0;
}