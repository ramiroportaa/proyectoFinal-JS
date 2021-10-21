$(function () {


    /* ===============================================================
         LIGHTBOX
      =============================================================== */
    lightbox.option({
        'resizeDuration': 200,
        'wrapAround': true
    });


    /* ===============================================================
         PRODUCT SLIDER
      =============================================================== */
    $('.product-slider').owlCarousel({
        items: 1,
        thumbs: true,
        thumbImage: false,
        thumbsPrerendered: true,
        thumbContainerClass: 'owl-thumbs',
        thumbItemClass: 'owl-thumb-item'
    });


    /* ===============================================================
         PRODUCT QUNATITY
      =============================================================== */
      $('.dec-btn').click(function () {
          var siblings = $(this).siblings('input');
          if (parseInt(siblings.val(), 10) >= 1) {
              siblings.val(parseInt(siblings.val(), 10) - 1);
          }
      });

      $('.inc-btn').click(function () {
          var siblings = $(this).siblings('input');
          siblings.val(parseInt(siblings.val(), 10) + 1);
      });


      /* ===============================================================
           DISABLE UNWORKED ANCHORS
        =============================================================== */
      $('a[href="#"]').on('click', function (e) {
         e.preventDefault();
      });

});
