;(function(){

	WriteUtil = {
		_isType:function( obj , type){
		//检查类型
			return Object.prototype.toString.call( obj ) === "[object "+type +"]";
		},
		_isHasOwn:function( obj , k ){
		//检查是否带有非原型属性

			return Object.prototype.hasOwnProperty.call( obj , k ) ;
		},
		_forEach:function( obj , fn , context ){
			var 
				length = obj.length;

			if( obj === null ) {
				throw new TypeError( "this is null or not defined" );
				//return;
			}
			/*已有方法返回*/
			if( Array.prototype.forEach && obj.forEach === Array.prototype.forEach ){

				return obj.forEach( fn , context ) ;
			}

			if( obj.length === +obj.length ){

				for( var i = 0 ; i < length ; i++ ){

					if( fn.call( context , obj[i] , i , obj ) === false )
						break;
				}
			}else{
				var k;
				for( k in obj ){

					if( this._hasOwn( obj , k ) ){

						if ( fn.call( context , obj[k] , i , obj ) === false )	
							break;
					}
				}

				if( this._hasDontEnumBug.hasDontEnumBug() ){
					var j , dontEnumsLength = this._hasDontEnumBug.dontEnums ;
					for ( j = 0; j < dontEnumsLength; j++) {

                         k = dontEnumsLength[i]
                         
                       if( this._hasOwn( obj , k ) ){
                        	
                        	if ( fn.call( context , obj[k] , i , obj ) === false )
                          	break;
                        }
                    }
				}
			}

			return obj;
		},
		_indexOf:function( obj , searchObj  ){
		//匹配数组中所查找的元素索引，不匹配则返回-1;

			var length = obj.length;

			if( obj === undefined || obj === null ) {
				throw new TypeError( "this is null or not defined" );
				//return;
			}
			if( searchObj === null ){

				return -1;
			}

			/*已有方法返回*/
			if( Array.prototype.indexOf && obj.indexOf == Array.prototype.indexOf ){
				return obj.indexOf( searchObj );
			}
			for( var i = 0 ; i < length ; i++ ){

				if( obj[i] === searchObj ){
			
					return  i;
				}
			}

			return -1;
		},
		_matchNumber:function( obj , searchObj ){

			var length = obj.length , count = 0;

			if( obj === undefined || obj === null ) {
				throw new TypeError( "this is null or not defined" );
				//return;
			}
			if( this._isType( obj , "String" ) ){
				obj = Array.prototype.slice.call( obj );
			}
			if( searchObj === null ){
				return false;
			}
			
			if ( this._indexOf( obj , searchObj) == -1 ) return false;

			for( var i = 0 ; i < length ; i++ ){
		
				if( obj[i] === searchObj ){
					
					count = ++count;
					continue;
				}
			}
			
			return count;
		},
		_unique:function( obj ){
		//数组去重
			var i , 
				length = obj.length ,
				hash = {},
				arr = []
			;
			/*排序遍历
			obj.sort();
			arr.push(obj[0]);*/

			this._forEach( obj ,function( value , i ){

				/* 使用indeof查找去重
				if( WriteUtil._indexOf( arr , obj[i] ) == -1){
					arr.push( obj[i] );	
				}*/
				/*排序遍历
				if( value !== arr[0] ){
					arr.unshift( value );
				}*/

				/*健值去重*/
				if( !hash[ typeof value + value ] ){
					arr.push( value );
					hash[ typeof value + value] = true;
				}

			})

			return arr;

		},
		_hasDontEnumBug: {
			hasDontEnumBug:function(){
				return !{toString:null}.propertyIsEnumerable("toString");
			},
			dontEnums: [
						'toString',
						'toLocaleString',
						'valueOf',
						'hasOwnProperty',
						'isPrototypeOf' ,
						'propertyIsEnumerable' ,
						'constructor'
					]


		},
		_keys: {
			kesConstrutor: function( obj , keyType ){
				/*不能直接使用这个方法，只是给下面两个函数提供*/
				/*使用下面的代码在IE7(也许IE8也是)下有个问题,就是如果传入一个其他窗口下的对象,不可枚举的属性也会获取到.*/

				var /*hasDontEnumBug = !{toString:null}.propertyIsEnumerable("toString") ,
					dontEnums = [
						'toString',
						'toLocaleString',
						'valueOf',
						'hasOwnProperty',
						'isPrototypeOf' ,
						'propertyIsEnumerable' ,
						'constructor'
					],*/

					dontEnumsLength = this._hasDontEnumBug.dontEnums.length,
					result = [] , i , j 
				;
				if( keyType == "keyName" && Object.keys){

					return Object.keys(obj) ;
				}

				if( typeof obj !== 'object' && typeof obj !== 'function' || obj === null ){

					throw new TypeError("Object.keys called on non-object!");
				}

				for( i in obj ){

					if( this._isHasOwn( obj , i) ){

						var _traget = keyType == "keyName" ? i :  ( keyType == "keyValue" ? obj[i] : null  ) ;

						result.push( _traget );
					}
				}

				if( this._hasDontEnumBug.hasDontEnumBug() ){					

					for ( j = 0; j < dontEnumsLength; j++) {

						if( this._isHasOwn( obj , this._hasDontEnumBug.dontEnums[j] ) ){

							var _tragetEnumBug = keyType == "keyName" ? this._hasDontEnumBug.dontEnums[j] :  ( keyType == "keyValue" ? obj[ this._hasDontEnumBug.dontEnums[j] ] : null ) ;

							result.push( _tragetEnumBug );
						}
					}
				}

				return result;
			},
			keysName: function( obj ){

				return this._keys.kesConstrutor( obj , "keyName" );
			},
			keysValue: function( obj ){

				return this._keys.kesConstrutor( obj , "keyValue" );
			}
		},
	_Class:function( classs ){

		var c ;
		if( document.querySelectorAll ){
		
			 c = document.querySelectorAll( "."+classs )
		}else{

			c = findtargets( document.body , [] , classs );

			var findtargets = function( root , ret ,classs){


				for (var i = root.firstChild ; i != null ; i = i.nextSibling ) {
			
					if( i.nodeType !== 1) continue ;


					var getClass= i.getAttribute('class') + "";

					if( getClass.match( classs ) !== null ){
					
						ret.push( i )

					}
				
					arguments.callee( i , ret ,classs );
					

				};

				return ret;
			}

		}

		return c ;
	}


	};

	window.WriteUtil = WriteUtil;
})();