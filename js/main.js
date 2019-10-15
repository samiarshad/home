
/**************** Navigation Scroll ****************/
// document.addEventListener('scroll', function (event) {
            
        // console.log('scrolling', event.target);
// }, true /*Capture event*/);

// $("#main").on("scroll", function(){
    // alert("here");
    
// });


document.addEventListener('scroll', function (event) {
    
    var scrollPos = $("#main").scrollTop();
    
    $('ul#navigation li a').each(function () {
        
        var currLink = $(this);
        var refElement = $(currLink.attr("href"));
        // console.log(currLink.attr("href")+' '+refElement.position().top+' '+refElement.height()+' '+scrollPos);
        
        if(!(currLink.parent().hasClass("active")) && refElement.position().top <=50 && scrollPos >= (refElement.position().top+refElement.height())){
        //remove and add active
        
        $("ul#navigation li.active").removeClass("active");
        currLink.parent().addClass("active");
        return;
    }
        
    });
}, true);


$.fn.exists = function () {
    return this.length > 0 ? this : false;
}
	//Handle window resize
	var resizeFlag=0;  
	$(window).resize(function(){
	    resizeFlag=1;
	})
	checkSizeChange();
	function checkSizeChange(){
	    if (resizeFlag) {
	      resizeFlag=0;
	      $(window).trigger('resized');
	    }
	    setTimeout(function(){
	      checkSizeChange();
	    }, 200);
	}

$(document).ready(function(){

	/*++++++++++++++++++++++++++++++++++++
		tooltips
	++++++++++++++++++++++++++++++++++++++*/
	$(".tooltips").tooltip();


	/*++++++++++++++++++++++++++++++++++++
		sidebar
	++++++++++++++++++++++++++++++++++++++*/
	var sideS, sidebar = {
		settings : {
			$side : $("#sidebar"),
			$main : $("#main"),
			$trigger : $("a.mobilemenu"),
			$totaltrigger : $(".social-icons, #main-nav, #main"),
			$sideFooter:$('#sidebar-footer'),
			$sideContent:$('#main-nav'),
			$sidebarWrapper:$('#sidebar-wrapper'),
			windowWidth:$(window).width()
			
		},

		init : function(){
			sideS = this.settings;
			sideS.contentPadding=parseInt(sideS.$sideContent.css('padding-bottom'));
			this.customScrollFlag=false;
			this.setScrollBar();
			this.setContentPadding();
			this.bindUiActions();
			this.setMobileSide();
		},

		isIn : function(){
			return (sideS.$main.hasClass("sideIn"));
		},

		bindUiActions : function(){
			var self = this;
			sideS.$trigger.click(function(e){
				e.preventDefault();
				if (self.isIn()){
					self.sideOut();
				}else{
					self.sideIn();
				}
			});
			sideS.$totaltrigger.click(function(){
				if ($(window).width() < 960 && self.isIn())
					self.sideOut(); 
			});

			sideS.$side.on('afterSlideIn',function(){
				if($(window).width()<=600){// under 600px sidebar will cover the whole screen
					sideS.$main.hide();
				}
			});

			sideS.$side.on('beforeSlideOut',function(){
				if($(window).width()<=600){
                sideS.$main.show();                    
				}
			});

			$(window).on('resized',function(){
				sideS.windowWidth=$(window).width();
				self.setContentPadding();
				self.setScrollBar();
				if ( sideS.windowWidth > 991 ){
					self.reset();
				}else{
					self.gomobile();
				}

				self.setMobileSide();
			});
		},

		sideIn : function() {
			var self = this;
			var sWidth=sideS.$side.width();
			sideS.$side.trigger('beforeSlideIn');
			var SidebarAnimIn = new TimelineLite({onComplete:function(){
				sideS.$side.trigger('afterSlideIn');
			}});
			SidebarAnimIn.to(sideS.$main,0.5,{left:sWidth,right:-sWidth,ease:Power2.easeIn},"-=0.2");
			sideS.$main.addClass('sideIn');
		},

		sideOut : function(){
			var self = this;
			sideS.$side.trigger('beforeSlideOut');
			var SidebarAnimOut = new TimelineLite({onComplete:function(){
				sideS.$side.trigger('afterSlideOut');
			}});
			SidebarAnimOut
				//.to(sideS.$side,0.2,{left:-250})
				.to(sideS.$main,0.5,{left:0,right:0,ease:Power2.easeIn},"-=0.2");
			sideS.$main.removeClass('sideIn');
		},

		reset : function(){
			sideS.$main.css({left:250, right:0});
			sideS.$side.css({left:0});
			sideS.$main.addClass('sideIn');
		},

		gomobile : function (){
			sideS.$main.css({left:0, right:0});
			sideS.$side.css({left:0});	
			sideS.$main.removeClass('sideIn');
		},
		setMobileSide:function(){
			var self=this;

			var tWidth=$(window).width();
			
			if (tWidth<600){
				sideS.$side.width(tWidth);
			}else{
				sideS.$side.width('');
				sideS.$main.show();
			}
			
		},
		setContentPadding:function(){
			var self=this;
			var footerHeight=sideS.$sideFooter.outerHeight();
			sideS.$sideContent.css({paddingBottom:sideS.contentPadding+footerHeight});
			
		},
		setScrollBar:function(){
			var self=this;

			if ((sideS.windowWidth>1024 || !isTouchSupported()) && !self.customScrollFlag){//Considiton that we want custom scrollbar
				self.setCustomScroll();
			}else if(sideS.windowWidth<=1024 && isTouchSupported() && self.customScrollFlag){ // Condition that we don't want custom scrollbar
				self.destroyCustomScroll();
			}
			
		},
		setCustomScroll:function(){

			this.customScrollFlag=true;
			sideS.$sidebarWrapper.niceScroll({
				horizrailenabled:false,
				cursorwidth: '6px',
			    cursorborder: 'none',
			    cursorborderradius:'0px',
			    cursorcolor:"#aaa"
			});
		
		},destroyCustomScroll:function(){
			sideS.$sidebarWrapper.niceScroll('destroy');
			this.customScrollFlag=false;

		}

	}
	sidebar.init();

	/*++++++++++++++++++++++++++++++++++++
		click event on ul.timeline titles
	++++++++++++++++++++++++++++++++++++++*/
	$("ul.timeline").children().eq(-1)
		.find(".text").slideDown()
		.addClass("open");

	$("ul.timeline").on("click","li", function(){
		$this.find(".text").slideDown();
		$this.addClass("open");
		$this.siblings('li.open').find(".text").slideUp();
		$this.siblings('li').removeClass("open");
	}).on('mouseenter','li',function(){
		$this = $(this);
		var anim = new TweenLite($(this).find(".subject"),0.4,{'padding-left':20, paused:true});
		($this.hasClass('open')) || anim.play();
	}).on('mouseleave','li',function(){
		var anim = new TweenLite($(this).find(".subject"),0.2,{'padding-left':0});
	});

	/*++++++++++++++++++++++++++++++++++++
		ul-withdetails details show/hide
	++++++++++++++++++++++++++++++++++++++*/
	$("ul.ul-withdetails li").find(".row").on('click',function(){
		// $this = $(this);
		$(this).closest("li").find(".details")
	        .stop(true, true)
	        .animate({
	            height:"toggle",
	            opacity:"toggle"
	        },300);
	}).on('mouseenter',function(){
		$this = $(this);
		var anim = new TweenLite($(this).closest("li").find(".imageoverlay"),0.4,{left:0});
	}).on('mouseleave', function(){
		var anim = new TweenLite($(this).closest("li").find(".imageoverlay"),0.2,{left:"-102%"});
	});
    
    



	/*++++++++++++++++++++++++++++++++++++
		Publications page categorization
	++++++++++++++++++++++++++++++++++++++*/
	
	
$('div#pub-grid').mixitup({
		layoutMode: 'list',
		easing : 'snap',
		transitionSpeed :600,
		onMixEnd: function(){
			$(".tooltips").tooltip();
		}
	}).on('click','div.pubmain',function(){
		var $this = $(this), 
			$item = $this.closest(".item");
		
		$item.find('div.pubdetails').slideToggle(function(){
			$this.children("i").toggleClass('icon-collapse-alt icon-expand-alt');
		},function(){
			$this.children("i").toggleClass('icon-expand-alt icon-collapse-alt');
		});
	});

	$( '#cd-dropdown' ).dropdownit( {
		gutter : 0
	} );

	$("[name=cd-dropdown]").on("change",function(){
		var item = this.value;		
		$('div#pub-grid').mixitup('filter',item);
	});

	

	/*++++++++++++++++++++++++++++++++++++
		gallery overlays and popups
	++++++++++++++++++++++++++++++++++++++*/ 

	// $(".grid").on("mouseenter","li",function(){
		// new TweenLite($(this).find(".over"),0.4,{bottom:0,top:0});
	// }).on("mouseleave","li",function(){
		// new TweenLite($(this).find(".over"),0.4,{bottom:"-100%", top:"100%"});
	// });

	// $('.popup-with-move-anim').magnificPopup({
		// type: 'image',

		// fixedContentPos: false,
		// fixedBgPos: true,

		// overflowY: 'auto',

		// closeBtnInside: true,
		// preloader: false,
		
		// midClick: true,
		// removalDelay: 400,
		// mainClass: 'my-mfp-slide-bottom'
	// });

	/* Detect touch devices*/
	function isTouchSupported(){
        //check if device supports touch
        var msTouchEnabled = window.navigator.msMaxTouchPoints;
        var generalTouchEnabled = "ontouchstart" in document.createElement("div");
     
        if (msTouchEnabled || generalTouchEnabled) {
            return true;
        }
        return false;

  	}

});


// $(window).load(function(){
	// var $container = $('#grid');
	// // initialize
	// $container.masonry({
	  // itemSelector: 'li'
	// });
	
// });

$('ul#navigation li a[href^="#"]').on('click', function (e) {
    
        e.preventDefault();
        var delay = 0;
        if($(window).width()<=600){
            delay = 500;
        }
        
        setTimeout(function(){
            
            document.querySelector($('ul#navigation li.active a').attr('href')).scrollIntoView({
            block: 'start',
            behavior: 'smooth'
        });
            
        }, delay);
        
    });
       
$("ul#navigation").on("click","li", function(){
    $this = $(this)
    $this.addClass("active");
    $this.siblings('li').removeClass("active");
    
})
