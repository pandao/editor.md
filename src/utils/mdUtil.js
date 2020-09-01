

var mdUtil = {
    // extend: function(ctor, superCtor)
	// {
	// 	var f = function() {};
	// 	f.prototype = superCtor.prototype;
		
	// 	ctor.prototype = new f();
	// 	ctor.prototype.constructor = ctor;
    // },

    cloneMethod: (obj, superObj)=>{
        return Object.assign({}, obj, superObj);
    },
    
    appendPrototype: function(obj, superObj){
        let source = superObj.prototype;
        let old = obj.prototype;
        console.log(`====`,{obj, source, old})
        obj.prototype = {...obj.prototype, ...superObj.prototype};
    },


};