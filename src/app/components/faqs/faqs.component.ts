import { Component } from '@angular/core';
declare var $: any;

@Component({
  selector: 'no-content',
  styleUrls: ['faqs.component.scss'],
  templateUrl: 'faqs.component.html'
})
export class FaqsComponent {
  public ngOnInit() {
    window.scrollTo(0, 0)
    $('.list-unstyled li').removeClass('active');
    $('#faqs-nav').addClass('active');

    /*    var acc = document.getElementsByClassName("accordion");
           for (var i = 0; i < acc.length; i++) {
               acc[i].addEventListener("click", function () {




                   [].forEach.call(document.querySelectorAll('.panel'), function (el) {
                       el.style.display = 'none';
                   });


                   $(".faq-main-2 .fas").removeClass("fa-minus").addClass("fa-plus");
                   $(this).find(".fas").removeClass("fa-plus").addClass("fa-minus");

                   [].forEach.call(document.querySelectorAll('.accordion'), function (el) {
                       el.classList.remove("active");
                   });

                   [].forEach.call(document.querySelectorAll('.panel'), function (el) {
                       el.style.display = 'none';
                   });

                   this.classList.toggle("active");

                   var panel = this.nextElementSibling;



                   if (panel.style.display === "block") {
                       panel.style.display = "none";
                   } else {
                       panel.style.display = "block";
                   }

               });
           }


        */

    $('.accordion').click(function () {
      $('.faq-main-2 .fas').removeClass('fa-minus').addClass('fa-plus');

      if ($(this).hasClass('active')) {
        console.info('yes');
        $(this).removeClass('active');
        $(this).next().removeClass('show');

        $('.faq-main-2 .fas').removeClass('fa-minus').addClass('fa-plus');
      } else {
        $('.accordion').removeClass('active');
        $('.panel').removeClass('show');
        $(this).find('.fas').removeClass('fa-plus').addClass('fa-minus');

        $(this).addClass('active');
        $(this).next().addClass('show');
      }
    });
  }
}
