// module PetriNets 
var PetriNets = {

    // returns a builder for composing Petri nets
	builder: function(){
		// processes are implemented as a matrix
		// but details are hidden
		var make_matrix = function( xdim, ydim ){
			var rows = new Array();
			for (var i=0; i<xdim; i++){
				rows[i] = new Array();
			}
			return {
				
				xlength: function(){ return xdim;},
				ylength: function(){ return ydim; },
				
				// get the value stored in (x,y)
				get: function(x, y){
					return rows[x][y];
				},
				// set a value in (x,y)
				set: function(x, y, val){
					rows[x][y] = val;
				},
				// return the row number x
				get_row: function(x){
				   return rows[x];	
				},
				
			};
		};
		// build a process from a matrix
		var make_process = function( matrix ){
			// a process is a matrix where entries are array of functions
			// matrix[i][j] = set of processes (non deterministically) reachable performing input i and output j
			return {
				// name of the process
				name:'unknown',
				// returns the set of processes reachable consuming input i
				go: function(name){
					var result = new Array();
					var row = matrix.get_row(name);
					for ( i in row ){
						if (row[i] !== undefined ){
							result.concat( row[i] );
						}
					}
					return result;			
				},
				// returns the set of processes reachable from input-output action (i,j)
				get: function(x, y){
					return matrix.get(x,y);
				},
				// returns the number of input channels
				get_input_size: function(){
				   return matrix.xlength();	
				},
				// returns the number of output channels
				get_output_size: function(){
					return matrix.ylength();
				},
				// show the matrix representation of the process after a single step
				print: function(){
					var out = '';
					
					// header
					out += '\t';
					for (var j=0; j<this.get_output_size(); j++){
						out += j.toString(2) + '\t';
					}
					out += '\n';
					
					for (var i=0; i<this.get_input_size(); i++){
						// row number
						out += i.toString(2) + '\t';
						for (var j=0; j<this.get_output_size(); j++){
							var array = this.get(i,j);
							
							if (array !== undefined){
								out += '{';
								for (var k=0; k<array.length; k++){
									// print(k);
									var p = array[k];
									// print( typeof p );
									out += p().name + ', ';
								}
								out += '}';
							} else {
								out += '*';
							}
							out += '\t';
						}
						out += '\n';
					}
					return out;
				},
			};
		};
		
		// utility function, build an array made of a single process
		var make_singleton = function(p){
			var array = new Array();
			var f = function(){ return p; };
			array.push(f);
			return array;
		};
		
		// definition of e and f
		var empty_matrix = make_matrix(2,2);
		var full_matrix = make_matrix(2,2);
		var e = make_process(empty_matrix);
		e.name = 'e';
		var f = make_process(full_matrix);
		f.name = 'f';
		
		empty_matrix.set(0,0, make_singleton(e));
		empty_matrix.set(0,1, undefined);
		empty_matrix.set(1,0, make_singleton(f));
		empty_matrix.set(1,1, undefined);
		
		full_matrix.set(0,0, make_singleton(f));
		full_matrix.set(0,1, make_singleton(e));
		full_matrix.set(1,0, undefined);
		full_matrix.set(1,1, make_singleton(f));
		
		return {
			
			// basic processes
			
			// returns an empty place
			empty: function(){
				return e;
			},
			// returns a full place
			full: function(){
				return f;
			},
			// returns a source component
			source: function(){
				var matrix = make_matrix(1,2);
				var p = make_process(matrix);
				p.name = 'src';
				matrix.set(0,0, make_singleton(p));
				matrix.set(0,1, make_singleton(p));
				return p;
			},
			// returns a sink component
			sink: function(){
				var matrix = make_matrix(2,1);
				var p = make_process(matrix);
				p.name = 'snk';
				matrix.set(0,0, make_singleton(p));
				matrix.set(1,0, make_singleton(p));
				return p;				
			},
			// returns an identity component (i.e. a wire)
			id: function(){
				var matrix = make_matrix(2,2);
				var p = make_process(matrix);
				p.name = "id";
				matrix.set(0,0, make_singleton(p));
				matrix.set(0,1, undefined);
				matrix.set(1,0, undefined);
				matrix.set(1,1, make_singleton(p));
				return p;
			},
			// returns a xor split wiring
			xor_split: function(){
				var split = make_matrix(2,4);
				var p = make_process(split);
				p.name = 'xs';
				split.set(0,0, make_singleton(p));
				split.set(0,1, undefined);
				split.set(0,2, undefined);
				split.set(0,3, undefined);
				split.set(1,0, undefined);
				split.set(1,1, make_singleton(p));
				split.set(1,2, make_singleton(p));
				split.set(1,3, undefined);
				return p;
			},
			// returns a xor merge wiring
			xor_merge: function(){
				var merge = make_matrix(4,2);
				var p = make_process(merge);
				p.name = 'xm';
				merge.set(0,0, make_singleton(p));
				merge.set(1,0, undefined);
				merge.set(2,0, undefined);
				merge.set(3,0, undefined);
				merge.set(0,1, undefined);
				merge.set(1,1, make_singleton(p));
				merge.set(2,1, make_singleton(p));
				merge.set(3,1, undefined);
				return p;
			},
			// returns an and split wiring
			and_split: function(){
				var split = make_matrix(2,4);
				var p = make_process(split);
				p.name = 'as';
				split.set(0,0, make_singleton(p));
				split.set(0,1, undefined);
				split.set(0,2, undefined);
				split.set(0,3, undefined);
				split.set(1,0, undefined);
				split.set(1,1, undefined);
				split.set(1,2, undefined);
				split.set(1,3, make_singleton(p));
				return p;				
			},
			// returns an and merge wiring
			and_merge: function(){
				var merge = make_matrix(4,2);
				var p = make_process(merge);
				p.name = 'am';
				merge.set(0,0, make_singleton(p));
				merge.set(1,0, undefined);
				merge.set(2,0, undefined);
				merge.set(3,0, undefined);
				merge.set(0,1, undefined);
				merge.set(1,1, undefined);
				merge.set(2,1, undefined);
				merge.set(3,1, make_singleton(p));
				return p;				
			},
			
			// compositions
			
			// returns the tensor product (parallel composition) of two processes
			dot: function(p, q){
				var that = this;
				var get_next = function(parray, qarray){
					var array = new Array();
					var seq = function(p, q){ return function(){ return that.dot(p(),q());}; };
					for (var i=0; i<parray.length; i++){
						for (var j=0; j<qarray.length; j++){
							var p1 = parray[i]; // funzione tipo f(){ return p;}
							var p2 = qarray[j]; // funzione tipo f(){ return p;}
							var s = seq(p1,p2); // funzione tipo f(){ return p1;p2 }
							array.push( s );
						}
					}
					return array;
				};
				var matrix = make_matrix(p.get_input_size()*q.get_input_size(), p.get_output_size()*q.get_output_size());
				
				for ( var i=0; i<p.get_input_size(); i++){
					for (var j=0; j<p.get_output_size(); j++){
						var pel = p.get(i,j);
						for (var z=0; z<q.get_input_size(); z++){
							for (var w=0; w<q.get_output_size(); w++){
								var qel = q.get(z,w);
								if ( qel !== undefined && pel !== undefined ){
									var next = get_next(pel, qel);
									// print(next.length);
									matrix.set( z+i*q.get_input_size(), w+j*q.get_output_size(), next);
								} else {
								    matrix.set( z+i*q.get_input_size(), w+j*q.get_output_size(), undefined);
								}
								
							}
						}
					}
				}
				
				var new_process = make_process(matrix);
				new_process.name = p.name + "|" + q.name;
				return new_process;
			},
			// returns the sequential composition of two processes
			seq: function(p, q){
				var that = this;
				var get_next = function(parray, qarray){
					var array = new Array();
					var seq = function(p, q){ return function(){ return that.seq(p(),q());}; };
					for (var i=0; i<parray.length; i++){
						for (var j=0; j<qarray.length; j++){
							var p1 = parray[i]; // funzione tipo f(){ return p;}
							var p2 = qarray[j]; // funzione tipo f(){ return p;}
							var s = seq(p1,p2); // funzione tipo f(){ return p1;p2 }
							array.push( s );
						}
					}
					return array;
				};
				// print('seq(' + p.name +', ' + q.name + ')');
				var matrix = make_matrix(p.get_input_size(), q.get_output_size());
				// print(p.get_input_size() + ' ' + q.get_output_size());
				for ( var i=0; i<p.get_input_size(); i++ ){ // per ogni riga
					for (var j=0; j<q.get_output_size(); j++){ // per ogni colonna
						// risultato della somma
						var sum = new Array();
						// print("starting sum " + i +", " + j);
						// per ogni elemento riga/colonna
						for (var z=0; z<p.get_output_size(); z++){
							var pnext = p.get(i,z); // array di processi
							var qnext = q.get(z,j); // array di processi
							if ( pnext !== undefined && qnext !== undefined ){
								// print (pnext.length + ' ' + qnext.length);
								var proc_list =  get_next(pnext, qnext);
								// print("length: " + proc_list.length );
								sum = sum.concat( proc_list );
							}
						}
						// aggiungi la somma dei processi alla matrice
						if ( sum.length > 0 ){
							matrix.set(i,j, sum);
						} else {
							matrix.set(i,j, undefined);
						}
					}
					
				}	
				var new_process = make_process(matrix);
				new_process.name = p.name + ";" + q.name;
				// print("end seq, created " + new_process.name);
				return new_process;
			},
			// returns the feedback of a process 
			feed: function(p){
				var get_next = function(p, ibin){
					var array = new Array();
					var i0 = parseInt((ibin+'0').substring(0,ibin.length), 2);
					var i1 = parseInt((ibin+'1').substring(0,ibin.length), 2);
					array.push( function(){ return p.get( i0 ,j);} );
					array.push( function(){ return p.get( i1 ,j);} );
					return array;
				};
				var put_leading_zero = function(text, length){
					while ( text.length < length ){
						text = '0' + text;
					}
					return text;
				};
				var matrix = make_matrix(p.get_input_size()/2, p.get_output_size());
				
				for (var i=0; i<matrix.xlength(); i++){
					for ( var j=0; j<matrix.ylength(); j++){
						var id = parseInt(i.toString(2) + j.toString(2),2);
						var pnext = p.get(id, j);
						// TODO i nomi dei processi devono avere ^ finale
						matrix.set(i, j, pnext);
					}
				}
				
				var new_process = make_process(matrix);
				new_process.name = p.name + '^';
				return new_process;
			},
		};
	},
	
	
};

var b = PetriNets.builder();

b.dot( b.xor_merge(), b.id() );

var b1 = b.seq( b.dot( b.source(), b.xor_split() ), b.dot( b.xor_merge(), b.id() ) );
var b2 = b.seq( b.full(), b.and_split() );
var b4 = b.dot( b.dot(b.id(), b.and_merge()), b.seq( b.empty(), b.sink() ));
var b6 = b.seq( b.dot(b1,b2), b4 );
var b7 = b.seq( b6, b.xor_merge() );
var n1 = b.feed( b7 );
	
var c1 = b.seq( b.dot(b.source(),b.id()), b.seq( b.xor_merge(), b.and_split()) );			
var c2 =  b.seq( b.feed( b.seq( b.xor_merge(),b.empty() ) ), b.sink());			
var c3 = b.seq( c1, b.dot(b.seq(b.and_split(), b.dot(c2, b.id())), b.id())  );	
var c4 = b.seq( b.and_split(), b.dot( b.id(), b.empty() ) );		
var c5 = b.seq( b.xor_split(), b.dot( c3, c4 ));
var c6 = b.seq( c5, b.dot( b.dot(b.id(),b.and_merge()), b.id()  ) );
var c7 = b.seq( c6, b.dot( b.id(),b.xor_merge() ) );
var c8 = b.seq( c7, b.xor_merge() );

var d1 = b.seq( b.feed( b.seq( b.xor_merge(),b.full() ) ), b.sink());	
var d2 = b.dot( d1, b.and_split() );
var d3 = b.seq( d2, b.and_merge() );
