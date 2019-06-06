---
layout: post
title: "The return of functional programming"
author: "Sreekar Chigurupati"
categories: programming
tags: functional-programming moore's-law concurrency parallelism
---

But first ...
![Arrow function](/assets/return-of-functional-programming/arrow.png)

## What is functional programming ?
![Lambda](/assets/return-of-functional-programming/lambda.svg){: width="100px" }

Functional programming is a programming paradigm in which most computation is treated as evaluation of functions. It emphasizes on expression evaluation instead of command execution. -- [Wikipedia](https://en.wikipedia.org/wiki/Functional_programming){:target="_blank"}

### When did it all start ?

In the 90's, there was a war between declarative programming and imperative programming. Declarative programming then represented by logic programming languages like Prolog and early functional languages like Erlang. And imperative languages were represented by procedural languages like C and object-oriented languages like Perl. These used abstract data types and procedures (sequence of commands) to compute.

You can infer, no doubt that imperative languages won, given the present state of computer languages. One big reason for this is that the process of writing code in an imperative fashion closely mimics the way programs are executed inside the computer. The theoretical basis of the modern computer being the von Neumann computer.

![von Neumann model](/assets/return-of-functional-programming/von-neumann.svg)  

Image by <a href="//commons.wikimedia.org/w/index.php?title=User:Kapooht&amp;action=edit&amp;redlink=1" class="new" title="User:Kapooht (page does not exist)">Kapooht</a> - <span class="int-own-work" lang="en">Own work</span>, <a href="https://creativecommons.org/licenses/by-sa/3.0" title="Creative Commons Attribution-Share Alike 3.0">CC BY-SA 3.0</a>, <a href="https://commons.wikimedia.org/w/index.php?curid=25789639">Link</a>

As you can see, the von Neumann model is closely mimicked by the execution flow in imperative languages. There is a strong correspondence between mutable variables and memory cells, variable dereferences and load instructions, variable assignments and store instructions, control structures and jumps. This sort of intuition helped programmers adopt them faster.

## What changed?

![It's rewind time!](/assets/return-of-functional-programming/rewind-time.jpg)  

It's time to remember a legend. [Gordon Moore](https://en.wikipedia.org/wiki/Gordon_Moore). He observed that the number of components on a dense integrated circuit doubles every year. [Moore's Law](https://en.wikipedia.org/wiki/Moore%27s_law)

![Moore's Law](/assets/return-of-functional-programming/moores-law.svg){: width="400px" }  

Image by <a href="//commons.wikimedia.org/wiki/User:Wgsimon" title="User:Wgsimon">Wgsimon</a> - <span class="int-own-work" lang="en">Own work</span>, <a href="https://creativecommons.org/licenses/by-sa/3.0" title="Creative Commons Attribution-Share Alike 3.0">CC BY-SA 3.0</a>, <a href="https://commons.wikimedia.org/w/index.php?curid=15193542">Link</a>

Over the past few years, the trend has subsided as controlling the control flow in the thin channel is becoming more difficult. We cannot make chips smaller anymore, unless there are revolutionary advancements in technology. To keep with the growing demand for computer power, we'll have to add more cores on a chip or use more chips. Huge volume workloads that require horizontal scaling are becoming more common. So we'll have to write software that better gels with the hardware we have.


There are two facets to this problem
 - Parallel programming
 - Concurrent programming

Parallel programming means using multiple units of hardware to compute something and speed up the process. But the program itself doesn't require this, it can still be solved on a single unit of hardware without any loss of functionality apart from speed.

Concurrent programming refers to programs that are inherently concurrent, that need to process large number of requests. Eg. Twitter. This has to be done in real-time and cannot be done in a sequential way.

While using conventional / imperative programming to implement either of these, we face some fundamental problems.
## The root of the problem
let's look at some pseudocode now

{% highlight scala %}
var x = 0
async { x = x + 1 }
async { x = x * 2 }  

// can give 0, 1, 2
{% endhighlight %}

The above program has two asynchronous operations running. We can see that the output is non-deterministic. This non-determinism is caused by concurrent threads accessing shared mutable state.

> non-determinism = parallel processing + mutable state

Out of these, parallel processing can't be avoided as our processors aren't growing anytime soon. Hence we have to avoid mutable state.

### The Solution

![Mickey meme](/assets/return-of-functional-programming/mickey.png){: width="400px" }  

Here come in functional programming and pure functions.

When is a function <code>pure</code>?
- It returns the same result if given the same arguments (it is also referred to as deterministic)
- It does not cause any observable side effects

So functions that use global objects for example would be impure functions.

In functional programming, the programmer would no longer have to worry about manually iterating values or accessing the elements of a data structure. All those would be hidden away in a declarative expression. This is so helpful that the imperative languages have now picked up some style in their syntax from this.

Example: two ways of iterating in Java. The second line is the modern form of expression

{% highlight java %}
for ( int i = 0 ; i < list.size ( ) ; ++i ) { doSomethingWith ( list.get ( i ) ) ; }
for ( SomeType s : list ) { doSomethingWith ( s ) ; }
{% endhighlight %}

With programs made [mostly](#rng) of pure functions, there'll be less mutable state to deal with. We can now think in terms of function compositions. Making one function out of others, this is sort of like thinking in terms of space, whereas imperative programming is thinking in terms of time. You don't have to worry about concurrent accesses in the functional example, as for each request, it can be served by it's own space, without worrying about affecting others. No need to worry about race conditions, deadlocks etc.
![Time vs Space](/assets/return-of-functional-programming/time-space.jpg){: width="400px" }

### Example : Scala
A simple example in Scala of how easy it is to parallelize stuff in modern functional languages with built-in functionality for parallelism. This code separates a list of people into minors and adults.

{% highlight scala %}
val people: Array[Person]
val (minors, adults) = people partition (_.age < 18)
{% endhighlight %}

Now the same code parallelized
{% highlight scala %}
val people: Array[Person]
val (minors, adults) = people.par partition (_.age < 18)
{% endhighlight %}

That's it. No worrying about writing the parallelization code, locks, software transactional memory YADA YADA
### The Functional Renaissance

This fundamental compatibility in building concurrent programs has brought back functional programming into the limelight. Now we also have languages that play to the strengths of both the paradigms (Scala). The brevity achieved while writing programs in the recursive way also helps. 

**Done! 🎉**

### Additional resources

- [Martin Odersky, "Working Hard to Keep It Simple" - OSCON Java 2011](https://www.youtube.com/watch?v=3jg1AheF4n0){:target="_blank"}
- [John Backus's Turing Award Lecture](https://www.thocp.net/biographies/papers/backus_turingaward_lecture.pdf){:target="_blank"}

John Backus's Turing Award Lecture was a watershed for the programming-language community because the inventor of FORTRAN, which was the dominant programming language of the day, stepped forward and said that the main stream of programming practice was flowing in a most unproductive direction. His lecture "Can Programming Be Liberated From the von Neumann Style?" 
- [lambda-the-ultimate](http://lambda-the-ultimate.org/){:target="_blank"} Good blog on programming language design

#### FUN FACT
#### <a name="rng"> Any function that relies on a random number generator cannot be pure 🤔 </a>
