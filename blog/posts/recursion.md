---
title: Recursion
description: Counting backwards, base cases, and what a function is really doing when it calls itself.
date: 2022-04-16
---

How do you teach a child to count backwards from 10? It usually goes “10, 9, 8”… etc you get the point. What we’re actually teaching isn’t the sequence of numbers necessarily, it’s that there is a relatively predictable way to get the answer and what we’re actually doing is subtracting 1 from whatever number we’re currently on until we arrive at something called the *base case*. What’s the base case you ask? Well, what are we counting backwards to?

## The Base Case

Zero, usually, or “liftoff” if you’re feeling dramatic. It’s the point where the question stops needing an answer from anywhere else. Nobody has to subtract anything to know what comes after 1 when the rule says “stop at 0.” The base case is the one answer you already have in your pocket.

## The Recursive Case

Everything before that is the *recursive case*: do one small piece of work, then hand the rest of the job to a smaller version of the same problem. Counting down from 10 is really “say 10, then count down from 9.” Counting down from 9 is “say 9, then count down from 8.” Same instructions every time, only the number changes.

Written as code, the whole idea fits in a few lines:

```python
def countdown(n):
    if n == 0:
        print("Liftoff!")
        return
    print(n)
    countdown(n - 1)

countdown(3)
# 3
# 2
# 1
# Liftoff!
```

The `if` is the base case. The last line is the recursive case: the function calls itself with a number that’s one step closer to the base case.

## What Happens Without a Base Case

If we do not include a base case, we will keep counting down from 10, foreverrrrr. Take out the `if` and nothing tells the function when to quit: it calls itself with 2, then 1, then 0, then -1, and on and on. Python won’t actually let that run forever. After about a thousand nested calls it gives up with a `RecursionError`. Every recursive function needs a base case, and every recursive call needs to move toward it.

## Where the Answers Come Back

Counting down only *does* something on the way in, but a lot of recursion earns its keep on the way back out. Factorial is the classic example, since 4! is just 4 × 3!, and 3! is just 3 × 2!, and so on:

```python
def factorial(n):
    if n <= 1:
        return 1
    return n * factorial(n - 1)
```

Here’s `factorial(4)` unrolled. Each call waits on the one below it, because it can’t multiply until it knows the answer:

```
factorial(4)
= 4 * factorial(3)
= 4 * (3 * factorial(2))
= 4 * (3 * (2 * factorial(1)))
= 4 * (3 * (2 * 1))     # base case reached
= 4 * (3 * 2)
= 4 * 6
= 24
```

Those waiting calls are what the computer keeps on the *call stack*: a pile of paused functions, each remembering where it left off. Once the base case returns a real answer, the pile unwinds from the top and every paused call finishes its multiplication.

## The Trick

When you’re writing a recursive function, the hardest part is getting out of the habit of tracing every step in your head. Don’t. Do these two things instead:

1. Decide what the base case is and what it returns.
2. Assume the function already works for a slightly smaller input, and write only the one step that gets you from that answer to yours.

Counting down from 10 felt easy as a kid because nobody made us hold all ten numbers in our heads at once. We only ever had to know the current number and what comes next, and recursion works exactly the same way.
