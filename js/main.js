(function ($) {
    "use strict";
    
    // Dropdown on mouse hover
    $(document).ready(function () {
        function toggleNavbarMethod() {
            if ($(window).width() > 992) {
                $('.navbar .dropdown').on('mouseover', function () {
                    $('.dropdown-toggle', this).trigger('click');
                }).on('mouseout', function () {
                    $('.dropdown-toggle', this).trigger('click').blur();
                });
            } else {
                $('.navbar .dropdown').off('mouseover').off('mouseout');
            }
        }
        toggleNavbarMethod();
        $(window).resize(toggleNavbarMethod);
    });
    
    
    // Back to top button
    $(window).scroll(function () {
        if ($(this).scrollTop() > 100) {
            $('.back-to-top').fadeIn('slow');
        } else {
            $('.back-to-top').fadeOut('slow');
        }
    });
    $('.back-to-top').click(function () {
        $('html, body').animate({scrollTop: 0}, 1500, 'easeInOutExpo');
        return false;
    });
    // Mejoras para el panel de productos de la tienda
    $(document).ready(function () {
        // Animación moderna usando clases CSS
        $('.agregar-carrito').on('click', function () {
            var btn = $(this);
            btn.addClass('agregado');
            btn.text('¡Agregado!');
            setTimeout(function () {
                btn.removeClass('agregado');
                btn.text('Agregar al carrito');
            }, 1200);
        });
    });

    // Suscripción al boletín
    $(document).ready(function () {
        $(".subscribe form").on("submit", function (e) {
            e.preventDefault();
            var email = $("#newsletter-email").val();
            var msgBox = $("#newsletter-msg");
            msgBox.html("");
            if (!email || !/^\S+@\S+\.\S+$/.test(email)) {
                msgBox.html('<span style="color:#ff4d4f;">Por favor ingresa un correo válido.</span>');
                return;
            }
            $("#newsletter-btn").prop("disabled", true).text("Enviando...");
            $.ajax({
                url: "subscribe.php",
                method: "POST",
                data: { email: email },
                dataType: "json",
                success: function (resp) {
                    if (resp.success) {
                        msgBox.html('<span style="color:#28a745;">' + resp.message + '</span>');
                        $(".subscribe form")[0].reset();
                    } else {
                        msgBox.html('<span style="color:#ff4d4f;">' + resp.message + '</span>');
                    }
                },
                error: function () {
                    msgBox.html('<span style="color:#ff4d4f;">Error de conexión. Intenta más tarde.</span>');
                },
                complete: function () {
                    $("#newsletter-btn").prop("disabled", false).text("Suscribirse");
                }
            });
        });
    });
})(jQuery);

