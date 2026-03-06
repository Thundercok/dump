
import math as m
import numpy as np
print("Exercise #1")

def exa(x):
    return x**1/2

def exb(x):
    return x**1/3

def exc(x): 
    return x**2/3

def exd(x):
    return (x**3 / 3)-(x**2 / 2 )- 2*x + 1/3

def exe(x):
    return ((2 * x**2 - 3)/( 7 * x +  4))

def exf(x):
    return ((5 * x**2 + 8*x -3)/(3 * x**2 + 2))

def exg(x):
    return (m.sin(x))

def exh(x):
    return (m.cos(x))

def exi(x):
    return  (3**x)

def exj(x):
    return (10**-x)

def efk(x):
    return (m.e**x)

def efl(x):
    return (m.log2(x))

def exm(x):
    return (m.log10())

def exn(x):
    return (m.log(x))

x = float(input())


for f in [exa, exb, exc, exd, exe, exf, exg, exh, exi, exj, efk, efl, exm, exn]:
    print(f"{f.__name__}(x): {f(x)}")
