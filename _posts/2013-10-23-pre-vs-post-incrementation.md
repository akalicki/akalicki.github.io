---
title: "The Case for Pre-Incrementation"
date: 2013-12-23 1:50
layout: post
category: programming
tags: programming theory c++
description: "The pre- and post-increment operators don't only return 
different values, but also exhibit potentially substantial performance 
tradeoffs. This post examines considerations that should be made when deciding 
which operator to use."
excerpt: "The pre- and post-increment operators don't only return different 
values, but also exhibit potentially substantial performance tradeoffs. This 
post examines considerations that should be made when deciding which operator 
to use."
---

<p class="lead">Take a minute to think about your favorite high-level programming language.</p>

It probably contains an idiom, or frequently used combination of keywords, of 
the type

{% highlight cpp %}
for (int i = 0; i < n; i++)
{% endhighlight %}

where <code>n</code> is an arbitrary number or variable. But sometimes, when 
browsing open source projects, you will see this line written as 

{% highlight cpp %}
for (int i = 0; i < n; ++i)
{% endhighlight %}

instead. What gives?? This brings up one of the more common questions in basic 
computer science theory:

### What's the difference between the operators?

The two operators accomplish the same task but with slightly different 
functionality. The pre-increment operator <code>++i</code> increments the 
variable <code>i</code> and then returns it. In contrast, the post-increment 
operator <code>i++</code> also increments the variable but returns the value 
<code>i</code> had _before_ it was incremented. Here's an example for the 
numerically oriented:

{% highlight cpp %}
int i = 2;
int j = ++i;  // j = 3, i = 3
int k = i++;  // k = 3, i = 4
{% endhighlight %}

### In a case like the for loop, why does the difference matter?

We now see that the two increment operators achieve the same result but with 
different return values. However, in most applications - like <code>for</code> 
loops - the return value of the operator is not used. To see why one might be 
preferred over the other let's examine a typical C++ implementation of 
post-increment:

{% highlight cpp %}
T T::operator++(int)
{
    T old(*this);
    ++*this;
    return old;
}
{% endhighlight %}

There are two important conclusions that can be drawn from the post-increment 
code: 

1. Post-increment can be implemented using pre-increment
2. Post-increment creates a copy of the original value so it can be returned

The post-increment operator not only adds an extra line of code to the 
pre-increment implementation, but also __stores the old value in a temporary__ 
so it can be returned after incrementing. As it must be written, the 
post-increment operator adds a bit of overhead to that required by 
pre-increment.

### And this actually makes a difference in runtime?

Well, it depends. Most modern compilers will optimize away the temporary 
required for post-increment if the return value is not used. Even if the 
compiler did not look for this type of optimization, the difference in 
performance between using pre- and post-increment on primitive values would be 
so minimal as to be barely perceptible even when running millions of 
calculations. For the most part, it is probably better to stick with the more 
easily recognizable post-increment operator for primitives even if it 
nominally sacrifices a bit of possible performance.

#### When dealing with objects, pre-increment is safer.

C++ language conventions call for the use of the pre-increment operator when 
advancing built-in iterators, and for good reason. While the performance 
difference between the two may not be noticeable for primitive values, when 
dealing with objects (especially user-defined ones) it can make quite a 
difference. Every time an object needs to be copied all data it stores is 
copied as well. As objects grow in size this process can prove quite costly 
and is worth avoiding if possible.

### Conclusion

Hopefully this post helped clarify the difference between the two increment 
operators and the reasons why objects are often pre-incremented in C++. Here 
are a few of the main takeaways to consider when deciding which operator to 
use:

1. The pre- and post-increment operators both do the same thing, but with 
__different return values__.
2. Post-increment requires a __potentially costly copy__ operation.
3. Most __compilers will optimize__ away this copy if the return value is not 
used.
4. __Pre-increment is the safer route__ if the return value is not needed, 
but __might confuse__ outside readers.

Which increment operator do you prefer? Is your choice situational or part of 
your coding style? Share your thoughts in the comments below!