import numpy as np
print("")

#Exercise 1
print("Exercise 1")
for a in range (50, 101):
    if a % 2 != 0:
       print(a, end=" ")
print("")

#Exercise 2
print("Exercise 2")
for b in range (1500, 2701):
    if (b % 7 != 0 and b % 5 == 0):
       print(b, end=" ")
print("")

#Exercise 3
print("Exercise 3")
for c in range(21):
    if c == 3 or c == 16:
        continue
    print(c, end=" ")
print("")

#Exercise 4    
print("Exercise 4")
def even_odd_count(num):
  even_num = 0
  odd_num = 0
  for number in num:
    if number % 2 != 0:
      even_num += 1
    else:
      odd_num += 1
  return even_num, odd_num
num = [1, 2, 3, 4, 5, 6, 7, 8, 9]
even_num, odd_num = even_odd_count(num)
print(num)
print("Number of even numbers:", even_num)
print("Number of odd numbers:", odd_num)

#Exercise 5
print("Exercise 5")
def calcM(): 
    M = 0 
    for i in range(1, 100): 
        M += (i/ (i + 1))
    return M 
print("M = ",calcM()) 

#Exercise 6
print("Exercise 6")
for x in np.arange(12, 39, dtype=np.int32 ):
    print(x, end=" ")
print("")

#Exercise 7
print("Exercise 7")
arr1 = np.array([ 2, 3, 4, 5,  6, 7])
arr2 = np.array([5, 6, 7, 8, 9, 10])
commonValues = np.intersect1d(arr1, arr2)
print(commonValues)







