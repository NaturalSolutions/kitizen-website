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
		var md = new MobileDetect(window.navigator.userAgent);
		if ( !md.phone() ) {
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
		self.$pagesContainer.dragend({
			pageClass: 'page',
			direction: 'vertical',
			keyboardNavigation: true,
			afterInitialize: function() {
				self.$pagesContainer.removeClass('initializing');
				if ( !self.config.firstSlide )
					self.onPageChange();
				else
					self.dragend.scrollToPage(self.config.firstSlide);
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
			self.$pagesContainer.dragend('up');
		});

		self.$dots.click(function() {
			var $me = $(this);
			self.dragend.scrollToPage($me.index()+1);
		});
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