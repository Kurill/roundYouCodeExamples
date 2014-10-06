$(function() {

    $('body').removeClass('no-js');
    $('.search-panel__extend').addClass('search_block');
    $('.frontpage-social').addClass('margin-active');
    //menu-hover
    var menuHover = function() {
        $('.main-menu__list a').on('mouseover', function() {
            $(this).parent().addClass('hover');
        });

        $('.main-menu__list a').on('mouseout', function() {
            $(this).parent().removeClass('hover');
        });
    }

    //menuHover();

    //select
    if ($('.select-custom select').length) {
        $('.select-custom select').ybSelect();
    }

    $('.popup-login').fancybox({
        closeBtn: true,
        openEffect: 'none',
        closeEffect: 'fade'
    });

    $('.popup-registration').fancybox({
        closeBtn: true,
        openEffect: 'none',
        closeEffect: 'fade',
        beforeLoad: function() {
            $('body').toggleClass('fancy-registration-mod');
        },
        afterClose: function() {
            $('body').toggleClass('fancy-registration-mod');
        }
    });

    $('.popup-password').fancybox({
        closeBtn: true,
        openEffect: 'none',
        closeEffect: 'fade',
        beforeLoad: function() {
            $('body').toggleClass('fancy-registration-mod');
        },
        afterClose: function() {
            $('body').toggleClass('fancy-registration-mod');
        }
    });

    $('.popup-message').fancybox({
        closeBtn: true,
        openEffect: 'none',
        closeEffect: 'fade',
        beforeLoad: function() {
            $('body').toggleClass('fancy-registration-mod');
        },
        afterClose: function() {
            $('body').toggleClass('fancy-registration-mod');
        }
    });

    $('.add-comment').fancybox({
        closeBtn: true,
        openEffect: 'none',
        closeEffect: 'fade'
    });

    var availableTags = [
        "ActionScript",
        "AppleScript",
        "Asp",
        "BASIC",
        "C",
        "C++",
        "Clojure",
        "COBOL",
        "ColdFusion",
        "Erlang",
        "Fortran",
        "Groovy",
        "Haskell",
        "Java",
        "JavaScript",
        "Lisp",
        "Perl",
        "PHP",
        "Python",
        "Ruby",
        "Scala",
        "Scheme"
    ];
    if ($("#automcomplete").length) {
        $("#automcomplete").autocomplete({
            source: availableTags,
            onSelect: function (suggestion) {
              $('#search_form').submit();
            }
        });
    }
    
    
    /* ---tabs--- */
    function tabs() {
        $('.publish-tabs').each(function() {
            var current = $(this).find('.tabs-nav .current').attr('href');
            $(this).find('.tabs-content .tabs-block:not(' + current + ')').hide();
            $('.tabs-nav a').on('click', function(e) {
                e.preventDefault();
                $this = $(this);
                $this.addClass('current').siblings().removeClass('current');
                $('.tabs-content').find($this.attr('href')).fadeIn(500).siblings('div').hide();
            });
        });
    }
    ;
    tabs();


    if ($(".checkboxclass").length) {
        $(".checkboxclass").Custom({
            customStyleClass: 'checkbox',
            customHeight: '13',
            enableHover: true
        });
    }

    //item-controls криво
    $('.item-controls').children('input').each(function() {
        if ($(this).is(':checked')) {
            $(this).parents('.item').addClass('active');
        } else {
            $(this).parents('.item').removeClass('active');
        }
    });

    $('.item-controls').children('input').on('click', function() {
        if ($(this).is(':checked')) {
            $(this).parents('.item').addClass('active');
        } else {
            $(this).parents('.item').removeClass('active');
        }
    });

    //placeholder
    if ($('.tipped').length) {
        $('.tipped').placeholder();
    }

    //dropdown
    (function() {
        var dropdown = $('.dropdown');
        $('.dropdown span').on('click', function() {
            $(this).siblings('ul').slideToggle();
        });

        $('.dropdown li').on('click', function() {
            var spanText = $(this).parents('.dropdown').children('span').text();
            var text = $(this).text();
            var typeto = $(this).data('typeto');
            var oldtypeto = $(this).parents('.dropdown').children('span').data('typeto');
            $(this).parents('.dropdown').children('span').text(text);
            $(this).parents('.dropdown').children('span').data('typeto', typeto);
            $(this).data('typeto', oldtypeto);
            $("#hiddencurrency").val(typeto);
            $(this).text(spanText);
            $(this).parent().slideToggle();
        });

        //сделать при клике не на dropdown закрывался

    })();

    if ($('#images-list').length) {
        $('#images-list').carouFredSel({
            auto: false,
            prev: "#images-list__prev",
            next: "#images-list__next"
        });
    }

    $("#images-list a")
            .attr('rel', 'fancybox')
            .fancybox({
                prevEffect: 'fade',
                nextEffect: 'fade',
                onStart: function() {
                    $("#images-list").trigger("pause");
                },
                onClosed: function() {
                    $("#images-list").trigger("play");
                },
                beforeShow: function() {
                    $('body').addClass('images-popup');
                },
                afterClose: function() {
                    $('body').removeClass('images-popup');
                }
            });

    $('.tabs-gallery__list-item')
            .attr('rel', 'tabs-gallery__list-item')
            .fancybox({
                prevEffect: 'fade',
                nextEffect: 'fade',
                onStart: function() {
                    $("#images-list").trigger("pause");
                },
                onClosed: function() {
                    $("#images-list").trigger("play");
                },
                beforeShow: function() {
                    $('body').addClass('images-popup');
                },
                afterClose: function() {
                    $('body').removeClass('images-popup');
                }
            });

    //add-plus
    $('.add-plus').on('click', function() {
        $(this).toggleClass('add-plus_active');
        if ($(this).parents('.list-gallery__item')) {
            $(this).parents('.list-gallery__item').toggleClass('list-gallery__item_selected');
            $(this).parents('.line').toggleClass('line_active');
        }
        $.get(add_complare_url,{id:$(this).data('id')});
        return false;
    });

    $('#toggle-type').on('change', function() {
        var valid = $('#toggle-type option:selected').data('type');
        if (valid == 'rieltor') {
            $('.line_agency').hide();
            $('.line_realtor').show();
        } else {
            $('.line_agency').show();
            $('.line_realtor').hide();
        }
    });

    $('.compare tr:odd:not(:first)').addClass('colorRows');
    

    //rating
    $('.rating').each(function() {
        if (!$(this).hasClass('rating_readonly')) {
            $(this).rating({
                fx: 'full',
                image: 'images/stars.png',
                minimal: 1,
                url: $('.rating').data('url')
            });
        } else {
            $(this).rating({
                readOnly: true,
                fx: 'full',
                image: 'images/stars.png'
            });
        }
    });

    $('.rating-mini').rating({
        readOnly: true,
        fx: 'half',
        image: 'images/stars-1.png'
    });

    if (!$('.object-2').length) {
        $('.rating-new').rating({
            readOnly: true,
            fx: 'half',
            image: 'images/stars-2.png'
        });
    }

    $('.object-2 .rating-new').rating({
        readOnly: true,
        fx: 'half',
        image: 'images/stars-3.png'
    });



    //btn_select-all
    $('.btn_select-all').on('click', function() {
        $(this).parents('.main-content').find('.item').addClass('active');
        $('.list-advertisment__main input:checkbox').attr('checked', true);
    });

    //delete-col
    $('.delete-col').on('click', function() {
        var count = $(this).parents('td').index();
        console.log($(this).parents('tr').children('td').length);
        if ($(this).parents('tr').children('td').length <= 1) {
            $('.compare-section').remove();
        } else {
            $(this).parents('table').find('tr').each(function() {
                $(this).children('td').eq(count - 1).remove();
                $(this).children('th').eq(count).remove();
            });

            $('.compare-schedule__table').each(function() {

                $(this).find('tr').each(function() {
                    $(this).children('td').eq(count - 1).remove();
                    $(this).children('th').eq(count).remove();
                });

            });
        }
        $.get(delete_compare_url,{id:$(this).data('id')});
        return false;
    });

    //btn_upload

    $('.btn_upload').on('click', function() {
        $(this).siblings('input').trigger('click');
    });

    //booking
    var bookingAdmin = {
        init: function() {
            this.clicking();
            this.prevClick();
            this.nextClick();
        },
        day: $('.calendar__weekend li'),
        prev: $('#calendar__nav-prev'),
        next: $('#calendar__nav-next'),
        clicking: function() {
            this.day.live('click', function() {
                $(this).toggleClass('selected');
            });
        },
        prevClick: function() {
            this.prev.on('click', function() {
                return false;
            });
        },
        nextClick: function() {
            this.next.on('click', function() {
                return false;
            })
        }
    };

    bookingAdmin.init();

    //steps-section hide
    $('#control-toggle').on('click', function() {
        var self = $(this)
        self.parents('.steps-section').toggleClass('hide');

        self.parent().siblings('.steps-section__content').slideToggle(function() {
            if (self.parents('.steps-section').hasClass('hide')) {
                self.text('открыть');
            } else {
                self.text('скрыть');
            }
        });
    });

    //types-adv__header
    $('.types-adv').addClass('types-adv_free');

    $(".types-adv__header input").on('change', function() {
        self = $(this);
        self.parents('.types-adv').toggleClass('types-adv_free');

        if (self.parents('.types-adv').hasClass('types-adv_free')) {
            self.parents('.types-adv').find('.btn_controls').attr('disabled', true);
        } else {
            self.parents('.types-adv').find('.btn_controls').attr('disabled', false);
        }
    });

    $('#page-nav').on('click', function(e) {
        e.preventDefault();
        window.history.back();
    });

    $('.search-panel__extend-header').on('click', function() {
        $(this).parent('.search-panel__extend').toggleClass('active');
        $('.frontpage-social').toggleClass('margin-active');
        $('.gallery_height').toggleClass('gallery-active');
        $('.sortirovka').toggleClass('sort_active');
    });



    // frontpageView
    $("#FrontmainView").on("click", function(event) {
        event.preventDefault();
        var target = $(event.target);
        if (target.is("a")) {
            target.parent("li").addClass('current').siblings('li').removeClass('current');
            if ($(target).attr("id") == "frontmainView2object") {
                $("#frontpageContent").removeClass('frontpage-content_4-column frontpage_map');
                $("#frontpageContent").addClass("frontpage-content_2-column");
                $('.search-panel__extend').addClass('search_block');//правильно
                $('.frontpage-social').addClass('margin-active');
                $('.list-gallery__img img').css('height', '160px');
            } else if ($(target).attr("id") == "frontmainView4object") {
                $("#frontpageContent").removeClass('frontpage-content_2-column frontpage_map');
                $("#frontpageContent").addClass("frontpage-content_4-column");
                $('.search-panel__extend').removeClass('search_block');
                $('.list-gallery__img img').css('height', '160px');
            } else if ($(target).attr("id") == "frontmainViewMap") {
                $("#frontpageContent").removeClass('frontpage-content_4-column frontpage-content_2-column');
                $("#frontpageContent").addClass("frontpage_map");
                $('.search-panel__extend').removeClass('search_block');
                $('.search-panel__extend').removeClass('active');
                $('.gallery_height').removeClass('gallery-active');
                $('.sortirovka').removeClass('sort_active');
                $('.list-gallery__img img').css('height', 'auto');
            }
        }
    });
    
});
function getCalendar(offset, advertId) {
    $.ajax({
        'url': ajax_calendar_url,
        'type': "GET",
        'data': {
            'offset':offset,
            'advertId':advertId
        },
        'success': function(data)
        {
            $("#calendar").html(data);
        }
    });
}

$(document).ready(function() {

    $('.booking .calendar__nav-next').on('click',function(){
        var offset = getOffset();
        offset = offset + 1;
        $("#calendar").attr({"offset":offset});
        var advertId = $("#advert_reservation_id").val();
        getCalendar(offset, advertId);
    });

    $('.booking .calendar__nav-prev').on('click',function(){
        var offset = getOffset();
        offset = offset - 1;
        var advertId = $("#advert_reservation_id").val();
        getCalendar(offset, advertId);
        $("#calendar").attr({"offset":offset});
    });
    $('.booking .calendar__nav-next').live('click',function(){
        var offset = getOffset();
        offset = offset + 1;
        var advertId = $("#advert_reservation_id").val();
        $("#calendar").attr({"offset":offset});
        getCalendar(offset, advertId);
    });

    $('.booking .calendar__nav-prev').live('click',function(){
        var offset = getOffset();
        offset = offset - 1;
        var advertId = $("#advert_reservation_id").val();
        getCalendar(offset, advertId);
        $("#calendar").attr({"offset":offset});
    });

    $(".not-booked").live('click',function(){
        var hash = $(".hash").val();
        var cost = $(".booking__input").val();
        var currency = 1;
        var status = 1;
        var advertId = $("#advert_reservation_id").val();
        var liDates = $(".calendar__weekend .selected span.day-number");
        var dates = "";
        for(var i = 0; i < liDates.length; i++) {
            var date = liDates[i].getAttribute("date");
            dates += date + ", ";
        }
        addReservation(dates, cost, currency, status, hash, advertId);
        $(".calendar__weekend .selected").removeClass("day-non-space");
        $(".calendar__weekend .selected").removeClass("booked");
        $(".calendar__weekend .selected").removeClass("booked-before");
        $(".calendar__weekend .selected").removeClass("booked-after");

        $(".calendar__weekend .selected").addClass(getStatusClass(status));
        $(".calendar__weekend .selected").find('.price-uah').text(cost);
    });

    $(".booked").live('click',function(){
        var hash = $(".hash").val();
        var cost = $(".booking__input").val();
        var currency = 1;
        var status = 2;
        var advertId = $("#advert_reservation_id").val();
        var liDates = $(".calendar__weekend .selected span.day-number");
        var dates = "";
        for(var i = 0; i < liDates.length; i++) {
            var date = liDates[i].getAttribute("date");
            dates += date + ", ";
        }
        addReservation(dates, cost, currency, status, hash, advertId);
        $(".calendar__weekend .selected").removeClass("day-non-space");
        $(".calendar__weekend .selected").removeClass("booked");
        $(".calendar__weekend .selected").removeClass("booked-before");
        $(".calendar__weekend .selected").removeClass("booked-after");

        $(".calendar__weekend .selected").addClass(getStatusClass(status));
        $(".calendar__weekend .selected").find('.price-uah').text(cost);
    });
    $(".booked-before").live('click',function(){
        var hash = $(".hash").val();
        var cost = $(".booking__input").val();
        var currency = 1;
        var status = 3;
        var liDates = $(".calendar__weekend .selected span.day-number");
        var dates = "";
        var advertId = $("#advert_reservation_id").val();
        for(var i = 0; i < liDates.length; i++) {
            var date = liDates[i].getAttribute("date");
            dates += date + ", ";
        }
        addReservation(dates, cost, currency, status, hash, advertId);
        $(".calendar__weekend .selected").removeClass("day-non-space");
        $(".calendar__weekend .selected").removeClass("booked");
        $(".calendar__weekend .selected").removeClass("booked-before");
        $(".calendar__weekend .selected").removeClass("booked-after");

        $(".calendar__weekend .selected").addClass(getStatusClass(status));
        $(".calendar__weekend .selected").find('.price-uah').text(cost);
    });
    $(".booked-after").live('click',function(){
        var hash = $(".hash").val();
        var cost = $(".booking__input").val();
        var currency = 1;
        var status = 4;
        var liDates = $(".calendar__weekend .selected span.day-number");
        var dates = "";
        var advertId = $("#advert_reservation_id").val();
        for(var i = 0; i < liDates.length; i++) {
            var date = liDates[i].getAttribute("date");
            dates += date + ", ";
        }
        addReservation(dates, cost, currency, status, hash, advertId);
        $(".calendar__weekend .selected").removeClass("day-non-space");
        $(".calendar__weekend .selected").removeClass("booked");
        $(".calendar__weekend .selected").removeClass("booked-before");
        $(".calendar__weekend .selected").removeClass("booked-after");

        $(".calendar__weekend .selected").addClass(getStatusClass(status));
        $(".calendar__weekend .selected").find('.price-uah').text(cost);

    });
});
function getOffset(){
    var offset = $("#calendar").attr("offset");
    if (offset == undefined) {
        offset = 0;
    }
    offset = parseInt(offset);
    return offset;
}

function addReservation(dates, cost, currency, status, hash, advertId) {
    $.ajax({
        'url': reservation_url,
        'type': "GET",
        'data': {
            'dates':dates,
            'cost':cost,
            'currency':currency,
            'status':status,
            'hash':hash,
            'advertId':advertId
        },
        'success': function(data)
        {
           // $("#calendar").html(data);
        }
    });
}

function getStatusClass(status) {
    var className = "day-non-space";
    switch(status) {
        case 1:
        className = "day-non-space";
        break;
        case 2:
        className = "booked";
        break;
        case 3:
        className = "booked-before";
        break;
        case 4:
        className = "booked-after";
        break;
    }
    return className;
}


