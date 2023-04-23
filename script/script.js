
$(function () {

  //E-mail Ajax Send
	$("form").submit(function() { //Change
		var th = $(this);
		$.ajax({
			type: "POST",
			url: "mail.php", //Change
			data: th.serialize()
		}).done(function() {
			alert("Thank you!");
			setTimeout(function() {
				// Done Functions
				th.trigger("reset");
			}, 1000);
		});
		return false;
	});


  $('.catalog-item__buy').on('click', function (e) {
    e.preventDefault();
    $('.popup-wrapper__buy-door').fadeIn();
    $('body').css('overflow', 'hidden');
  });
  $('.popup__btn-close').on('click', function () {
    $('.popup-wrapper__buy-door').fadeOut();
    $('body').css('overflow', 'auto');
  });
  $('.overlay').on('click', function () {
    $('.popup-wrapper__buy-door').fadeOut();
    $('body').css('overflow', 'auto');
  });

  // Маска телефона
  $('.Phone').mask("+7(999) 999-99-99");

  // Стрелка обратно наверх
  function backToTop() {
    let button = $('.back-to-top');
    $(window).on('scroll', () => {
      if ($(this).scrollTop() >= 200)  {
        button.fadeIn();
      } else {
        button.fadeOut();
      }
    });

    button.on('click', (e) => {
      e.preventDefault();
      $('html').animate({scrollTop: 0}, 2000);
    })
  }
  backToTop();

  // Якоря
  $(".anchor").on("click", function (event) {
      event.preventDefault();
      var id  = $(this).attr('href'),
          top = $(id).offset().top;
      $('body,html').animate({scrollTop: top}, 1500);
  });

  // Маска для телефона
  $('.main-block__form-phone').mask("+7(999) 999-99-99");
  function setCursorPosition(pos, e) {
    e.focus();
    if (e.setSelectionRange) e.setSelectionRange(pos, pos);
    else if (e.createTextRange) {
      var range = e.createTextRange();
      range.collapse(true);
      range.moveEnd("character", pos);
      range.moveStart("character", pos);
      range.select()
    }
  }
  function mask(e) {
    //console.log('mask',e);
    var matrix = this.placeholder,// .defaultValue
      i = 0,
      def = matrix.replace(/\D/g, ""),
      val = this.value.replace(/\D/g, "");
      def.length >= val.length && (val = def);
      matrix = matrix.replace(/[_\d]/g, function(a) {
        return val.charAt(i++) || "_"
      });
      this.value = matrix;
      i = matrix.lastIndexOf(val.substr(-1));
      i < matrix.length && matrix != this.placeholder ? i++ : i = matrix.indexOf("_");
      setCursorPosition(i, this)
    }
    window.addEventListener("DOMContentLoaded", function() {
      var input = document.querySelector(".popup__input");
      input.addEventListener("input", mask, false);
      input.focus();
      setCursorPosition(3, input);
    });


    // Бургер
    $('.burger').on('click', function(){
      $(this).toggleClass('active');
      $('.nav__list').slideToggle();
    });


    // Слайдер комментов
    $('.comment__slider').slick({
      slidesToShow: 2,
      infinite: false,
      responsive: [
          {
          breakpoint: 769,
          settings: {
            slidesToShow: 1
          }
        }
      ]
    });

    // Слайдер преимуществ
    $('.advantages__slider').slick({
      arrows: false,
      slidesToShow: 4,
      responsive: [
          {
          breakpoint: 769,
          settings: {
            slidesToShow: 2,
            arrows: true
            }
          },{
            breakpoint: 481,
            settings: {
              arrows: true,
              slidesToShow: 1
            }
        }
      ]
    });
});
