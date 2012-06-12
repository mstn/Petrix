## What is Petrix?

Petrix is a Javascript framework to build Petri Nets. If you don't know what Petri Nets are, Wikipedia has a beautiful [http://en.wikipedia.org/wiki/Petri_net](entry) for this topic.
The kind of Petri Nets you can build with Petrix are just a particular case of Petri Nets where places can store only one token at the time and communication is synchronous, that is, a global clock synchronizes every firing.
I implemented the code because I was curious to understand dataflow networks where nodes have a state and are not just "functionals" as in Kahn networks. The simplest case of stateful nodes is represented by Petri nets where the state of a place can be on (full) or off (empty) depending on the past interactions with the enviroment. In addition it turned out that this kind of networks can be modelled easily using Interaction Categories.
Interaction categories are a formal tool to define dynamical processes. You can find more about Interaction categories in the bibliography below. [1] is the seminal paper while [2] describes an application of the framework to dataflows. 
Following the interaction category paradigm, a Petri Net is a process of kind A->B, or equivalentely a subset of AxB where A and B are sets of symbols. In other words, we can represent Petri Nets as matrices (hence the name Petrix as a shorthand for Petri + matrix). Note that the matricial representation of Petri Nets is not the same as the standard one (see Wikipedia article above). In fact, the standard use of matrices captures the static structure of Petri Nets while matrices in Petrix representes the dynamical behavior of Petri Nets.

[1] introduces Interaction Categories; the framework is a bit more general than that presented here. The idea of rapresenting processes as matrices is already present in this paper and in the motto "processes are relations extended in time". However, my source of inspiration was [4] where circuit composition is defined in terms of matricial operations.
[2] defines a denotational semantics for dataflow networks in terms of Interaction Categories and proves that this semantic is equivalent to traditional Kahn semantics for dataflows when networks are deadlock-free.
[3] introduces a simplified notation for Petri nets where places have only one input and one output and transitions are not represented by node, but by multi-edges. Petrix defines Petri nets in this way.

## How to run the code

The code is in Javascript. This means that you need a Javascript interpreter to run the code.
The easiest solution is to run the code within Firefox with Firebug plugin installed.
Firebug is a Javascript debugger that comes with a useful shell to play with your Petri Nets.

1. Open Firefox. If you don't have it, you can download it freely from http://www.mozilla.org/.
2. Go to http://getfirebug.com/ and follow the instructions to install Firebug.
3. Open index.html with Firefox. In order to run the code with Firefox, I have embedded the script within an empty html page. You can modify the page as you prefer.
4. Click on the bug symbol to open Firebug within Firefox.

Alternatively, you can use one of the several Javascript shells. For example, you can run the code in spider monkey with the command:

<pre><code>
   $ js -f Petrix2.js -f -
</code></pre>
	
	
However, debugging is more difficult (or, at least, I don't know how to debug the code in spider-monkey!).	

## Some examples

In order to build Petri components, you need a builder. A builder is just an object that does the work for you. In order to obtain a builder, write

<pre><code>
   	// get a builder
	var b = PetriNets.builder();
</code></pre>
	
	
Now b is the variable storing the builder object. The builder object has several methods (see comments in the code) to build basic component (empty(), full(), ... ) or to compose Petri nets into more complex nets (seq(), dot(), feed()). For example,

<pre><code>
	// create an empty place
	var e = b.emtpy();
	// create a full place
	var f = b.full();
	// sequential composition full place followed by empty place
	var f_seq_e = b.seq(f, e);
	// parallel composition (tensor product or dot)
	var f_par_e = b.dot(f, e);
	// feedback
	var n = b.feed( e );
</code></pre>	


You can peek at the matrix representation through the command

<pre><code>
    p.print()
</code></pre>

Rows are inputs, columns are outputs and entries are next processes. For example, the xor split xs is defined by the following matrix:

       00  01  10  11
    0  xs  *   *   *
    1  *   xs  xs  *

The dot * means that the process is undefined. Xor split has one input and two outputs. The value on the input channel is given by row index, that is, we can have only two configurations: in the first one the channel has no token (0) in the other one has one token (1). The values on two output two channels are exactly four (2^2=4): 00 (no token, no token), 01 (no token, one token), 10 (one token, no token), 11 (one token, one token). Channel configurations are column indices. The entry of the matrix represents the next set of processes obtained performing actions.

## Documentation

See GitHub Wiki for this project.

## Licence

The code is released under Affero GPL Licence.

## Bibliography

[1] Samson Abramsky, Simon Gay and Rajagopal Nagarajan,
Interaction Categories and the Foundations of Typed Concurrent Programming.
Chapter in Deductive Program Design,
1996

[2] Simon Gay and Rajagopal Nagarajan,
Intentional and extensional semantics of dataflow programs.
Formal aspects of computing,
2003

[3] Pawel Sobocinski, 
Representations of Petri Net Interactions. 
CONCUR 2010, 554-568, 
2010

[4] Noson S. Yanofsky and Mirco A. Mannucci,
Quantum Computing for Computer Scientists.
Cambridge University Press,
1st Edition,
2008