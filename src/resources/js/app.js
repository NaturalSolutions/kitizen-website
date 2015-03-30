var kitizen = kitizen || {};
var console = console || {log:function(){}};

kitizen.App = function(config)
{
	var self = this;
	self.config = {
		firstSlide: 1
	};

	self.__construct = function(config)
	{
		self.config = _.assign(self.config, config);

		self.initElements();
		self.md = new MobileDetect(window.navigator.userAgent);
		if ( !self.md.phone() ) {
			self.initDragend();
			self.initNav();
		};

		self.initPageKit();
	};

	self.initElements = function()
	{
		self.$pagesContainer = $('#pages');
		self.$arrowDown = $('.btn-pagination.down');
		self.$dotsConatiner = $('#dots');
		self.$dots = self.$dotsConatiner.find('li');
	}

	self.initDragend = function()
	{
		self.$pagesContainer.addClass('initializing');
		var detect = !self.md.mobile() ? true : false;
		self.$pagesContainer.dragend({
			pageClass: 'page',
			direction: 'vertical',
			preventDrag: detect,
			keyboardNavigation: true,
			afterInitialize: function() {
                self.onDragendInit();
			},
			onSwipeEnd: function() {
				self.onPageChange();
			}
		});

		self.dragend = self.$pagesContainer.data('dragend');
	};

	self.initNav = function()
	{
		self.$arrowDown.click(function() {
			//self.$pagesContainer.dragend('down');
			self.$pagesContainer.dragend('up');
		});

		self.$dots.click(function() {
			var $me = $(this);
			self.dragend.scrollToPage($me.index()+1);
		});
		//Add jquery mouseWheel
		$('body').on('mousewheel',
			_.throttle(
				function(event){
					if (event.deltaY < 0){
						self.$pagesContainer.dragend('up');
					}else{
						self.$pagesContainer.dragend('down');
					}
					self.positionY = event.deltaY;
				},1000)
			);
	};

	self.onDragendInit = function()
    {
        self.$pagesContainer.removeClass('initializing');
        if (!self.config.firstSlide)
            self.onPageChange();
        else
            self.dragend.scrollToPage(self.config.firstSlide);

        if ( !self.md.mobile() ) {
			AdobeEdge.loadComposition('animation_homepage', 'EDGE-259079897', {
			    scaleToFit: "none",
			    centerStage: "none",
			    minW: "0px",
			    maxW: "undefined",
			    width: "596px",
			    height: "800px"
			}, {
			    "dom": {}
			}, {
			    "style": {
			        "${symbolSelector}": {
			            "isStage": "true",
			            "rect": ["undefined", "undefined", "600px", "800px"],
			            "fill": ["rgba(255,255,255,1)"]
			        }
			    },
			    "dom": [{
			        "rect": ["0", "0", "600px", "800px", "auto", "auto"],
			        "id": "Poster",
			        "fill": ["rgba(0,0,0,0)", "images/Poster.png", "0px", "0px"],
			        "type": "image",
			        "tag": "img"
			    }]
			});
		};
    };

	self.onPageChange = function()
	{
		var pageIndex = self.dragend.page;
		self.$dots.removeClass('active');
		self.$dots.eq(pageIndex).addClass('active');

		var $pages = self.dragend.pages;
		$pages.removeClass('active');
		var $currentPage = $pages.eq(pageIndex);
		$currentPage.addClass('active');

		$('body').alterClass('page-*', 'page-'+$currentPage.attr('name'));
	};

	self.initPageKit = function()
	{
		var $page = $('#pages .page-kit');
		var $moduleBtns = $page.find('.modules li');
		var $moduleInfo = $page.find('.module-info');
		$moduleBtns.hover(function() {
			$moduleInfo.html($(this).children('.info').html());
		}, function() {
			$moduleInfo.html('');
		});
	};

	self.__construct(config);
};